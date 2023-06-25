resource "aws_lambda_function" "rds" {
  filename = data.archive_file.rds.output_path
  function_name = "schedule-rds-function"
  role = aws_iam_role.this.arn
  handler = "schedule-rds.handler"
  runtime = "python3.8"
  publish = false
  timeout = 10
  source_code_hash = data.archive_file.rds.output_base64sha256
}

resource "aws_lambda_function" "ec2" {
  filename = data.archive_file.ec2.output_path
  function_name = "schedule-ec2-function"
  role = aws_iam_role.this.arn
  handler = "schedule-ec2.handler"
  runtime = "python3.8"
  publish = false
  timeout = 10
  source_code_hash = data.archive_file.ec2.output_base64sha256
}

data "archive_file" "rds" {
  type = "zip"
  source_file = "schedule-rds.py"
  output_path = "schedule-rds.zip"
}

data "archive_file" "ec2" {
  type = "zip"
  source_file = "schedule-ec2.py"
  output_path = "schedule-ec2.zip"
}

resource "aws_iam_role" "this" {
  name = "schedule-function-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          "Service": [
            "lambda.amazonaws.com"
          ]
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "this" {
  name = "schedule-function-policy"
  role = aws_iam_role.this.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:DescribeInstances*"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ec2:TerminateInstance*"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:ec2:eu-west-1:103348857345:instance/*"
      },
      {
        Action = [
          "rds:DescribeDBInstances*",
          "rds:StopDBInstance"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:rds:eu-west-1:103348857345:db:*"
      },
    ]
  })
}

resource "aws_cloudwatch_event_rule" "this" {
  name = "schedule-rule"
  schedule_expression = "cron(0 1 ? * * *)"
}

resource "aws_cloudwatch_event_target" "rds" {
  rule = aws_cloudwatch_event_rule.this.name
  target_id = "schedule-rds-target"
  arn = aws_lambda_function.rds.arn
}

resource "aws_cloudwatch_event_target" "ec2" {
  rule = aws_cloudwatch_event_rule.this.name
  target_id = "schedule-ec2-target"
  arn = aws_lambda_function.ec2.arn
}

resource "aws_lambda_permission" "rds" {
  statement_id = "AllowRDSExecutionFromCloudWatch"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rds.function_name
  principal = "events.amazonaws.com"
  source_arn = aws_cloudwatch_event_rule.this.arn
}

resource "aws_lambda_permission" "ec2" {
  statement_id = "AllowEC2ExecutionFromCloudWatch"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ec2.function_name
  principal = "events.amazonaws.com"
  source_arn = aws_cloudwatch_event_rule.this.arn
}
