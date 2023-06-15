resource "aws_lambda_function" "this" {
  s3_bucket = aws_s3_bucket.deployment.id
  s3_key = aws_s3_object.this.id
  function_name = "react-app-serverless-function"
  role = aws_iam_role.this.arn
  handler = "index.handler"
  runtime = "nodejs16.x"
  publish = true
  timeout = 10
  source_code_hash = data.archive_file.this.output_base64sha256
}

resource "aws_iam_role" "this" {
  name = "react-app-serverless-function-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          "Service": [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        }
      },
    ]
  })
}
