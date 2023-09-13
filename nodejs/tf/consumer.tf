resource "aws_lambda_function" "consumer" {
    filename = data.archive_file.consumer.output_path
    handler = "consumer.handler"
    runtime = "nodejs18.x"
    function_name = "${var.app_name}-consumer"
    role = aws_iam_role.main.arn
    timeout = 30
    source_code_hash = data.archive_file.consumer.output_base64sha256
    architectures = ["arm64"]
    vpc_config {
        subnet_ids         = [data.aws_subnet.main.id]
        security_group_ids = [aws_security_group.consumer.id]
    }
    environment {
        variables = {
            DB_HOST = "react-app.casjyk0nx1x8.eu-west-1.rds.amazonaws.com"
            DB_USER = jsondecode(data.aws_secretsmanager_secret_version.rds.secret_string)["username"]
            DB_PASS = jsondecode(data.aws_secretsmanager_secret_version.rds.secret_string)["password"]
            DB_NAME = var.app_name
            API_HOST = "klofron-app-three-api.klofron.uk"
            API_PORT = 443
        }
    }
}

data "archive_file" "consumer" {
  type = "zip"
  source_dir = ".."
  output_path = "klofron-app-three-consumer.zip"
  excludes = ["package.json", "package-lock.json", "tf/klofron-app-three-consumer.zip", "tf", "index.js", "death.js"]
}

resource "aws_security_group" "consumer" {
    name = "${var.app_name}-consumer-lambda-sg"
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
        Name = "${var.app_name}-consumer-lambda-sg"
    }
}

resource "aws_cloudwatch_event_rule" "consumer" {
    name = "schedule-consumer-rule"
    schedule_expression = "cron(*/1 * ? * * *)"
}

resource "aws_cloudwatch_event_target" "consumer" {
    rule = aws_cloudwatch_event_rule.consumer.name
    target_id = "schedule-consumer-target"
    arn = aws_lambda_function.consumer.arn
}

resource "aws_lambda_permission" "consumer" {
    statement_id = "AllowConsumerExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.consumer.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.consumer.arn
}