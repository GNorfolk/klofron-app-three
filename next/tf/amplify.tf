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
    "NEXTAUTH_URL"              = "https://www.klofron.uk"
    "NEXT_PUBLIC_API_HOST"      = "https://api.klofron.uk"
  }
}