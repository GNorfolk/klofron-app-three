resource "aws_lambda_function" "death" {
    filename = data.archive_file.death.output_path
    handler = "death.handler"
    runtime = "nodejs18.x"
    function_name = "${var.app_name}-death"
    role = aws_iam_role.main.arn
    timeout = 10
    source_code_hash = data.archive_file.death.output_base64sha256
    architectures = ["arm64"]
    vpc_config {
        subnet_ids         = [data.aws_subnet.main.id]
        security_group_ids = [aws_security_group.death.id]
    }
    environment {
        variables = {
            DB_HOST = "react-app.casjyk0nx1x8.eu-west-1.rds.amazonaws.com"
            DB_USER = jsondecode(data.aws_secretsmanager_secret_version.rds.secret_string)["username"]
            DB_PASS = jsondecode(data.aws_secretsmanager_secret_version.rds.secret_string)["password"]
            DB_NAME = var.app_name
        }
    }
}

data "archive_file" "death" {
  type = "zip"
  source_dir = ".."
  output_path = "klofron-app-three-death.zip"
  excludes = ["package.json", "package-lock.json", "tf/klofron-app-three-death.zip", "tf", "index.js", "consumer.js"]
}

resource "aws_security_group" "death" {
    name = "${var.app_name}-death-lambda-sg"
    vpc_id = data.aws_vpc.main.id
    ingress {
        from_port        = 0
        to_port          = 0
        protocol         = "-1"
        cidr_blocks      = [data.aws_vpc.main.cidr_block]
    }
    egress {
        from_port        = 0
        to_port          = 0
        protocol         = "-1"
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }
    tags = {
        Name = "${var.app_name}-death-lambda-sg"
    }
}

resource "aws_cloudwatch_event_rule" "death" {
    name = "schedule-death-rule"
    schedule_expression = "cron(0 12 ? * * *)"
}

resource "aws_cloudwatch_event_target" "death" {
    rule = aws_cloudwatch_event_rule.death.name
    target_id = "schedule-death-target"
    arn = aws_lambda_function.death.arn
}

resource "aws_lambda_permission" "death" {
    statement_id = "AllowDeathExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.death.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.death.arn
}