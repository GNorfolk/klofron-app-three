data "aws_ssm_parameter" "this" {
  name = "github_access_token"
}

resource "aws_amplify_app" "this" {
  name = "ka3-next"
  repository = "https://github.com/GNorfolk/klofron-app-three"
  auto_branch_creation_patterns = []
  enable_auto_branch_creation = false
  enable_basic_auth = false
  enable_branch_auto_build = false
  enable_branch_auto_deletion = false
  iam_service_role_arn = "arn:aws:iam::103348857345:role/service-role/AmplifySSRLoggingRole-d21g0omcuv5pk9"
  platform = "WEB_COMPUTE"

  # GitHub personal access token
  access_token = data.aws_ssm_parameter.this.value

  # The default build_spec added by the Amplify Console for React.
  build_spec = <<-EOT
    version: 1
    applications:
      - frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> .env
                - npm run build
          artifacts:
            baseDirectory: .next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
        appRoot: next
  EOT

  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }

  environment_variables = {
    "AMPLIFY_DIFF_DEPLOY"       = "false"
    "AMPLIFY_MONOREPO_APP_ROOT" = "next"
    "NEXTAUTH_URL"              = "https://amplify.klofron.uk"
    "NEXT_PUBLIC_API_HOST"      = "https://api.klofron.uk"
  }
}

resource "aws_amplify_branch" "this" {
  app_id      = aws_amplify_app.this.id
  branch_name = "main"

  framework = "Next.js - SSR"
  stage     = "PRODUCTION"

  environment_variables = {
    "AMPLIFY_DIFF_DEPLOY"       = "false"
    "AMPLIFY_MONOREPO_APP_ROOT" = "next"
    "NEXTAUTH_URL"              = "https://amplify.klofron.uk"
    "NEXT_PUBLIC_API_HOST"      = "https://api.klofron.uk"
  }
}

resource "aws_amplify_domain_association" "this" {
  app_id      = aws_amplify_app.this.id
  domain_name = "klofron.uk"

  sub_domain {
    branch_name = aws_amplify_branch.this.branch_name
    prefix      = "amplify"
  }
}

resource "aws_route53_record" "amplify" {
  zone_id = data.aws_route53_zone.this.zone_id
  name = "amplify.klofron.uk"
  type = "CNAME"
  records = [aws_amplify_app.this.default_domain]
  ttl = 60
}
