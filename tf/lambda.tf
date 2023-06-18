resource "aws_lambda_function" "this" {
  filename = data.archive_file.this.output_path
  function_name = "schedule-rds-function"
  role = aws_iam_role.this.arn
  handler = "lambda.handler"
  runtime = "python3.8"
  publish = false
  timeout = 10
  source_code_hash = data.archive_file.this.output_base64sha256
}

data "archive_file" "this" {
  type = "zip"
  source_file = "lambda.py"
  output_path = "lambda.zip"
}

resource "aws_iam_role" "this" {
  name = "schedule-rds-function-role"
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
  name = "schedule-rds-function-policy"
  role = aws_iam_role.this.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
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