provider "aws" {
  region = "eu-west-1"
}

terraform {
  backend "s3" {
    bucket = "norfolkgaming-tfstate"
    key = "next.tfstate"
    region = "eu-west-1"
  }
}

resource "aws_lambda_function" "this" {
  s3_bucket = "klofron-react-app"
  s3_key = aws_s3_object.this.id
  function_name = "react-app-serverlessFunction-6gLfMjRn66wm"
  role = aws_iam_role.this.arn
  handler = "index.handler"
  runtime = "nodejs16.x"
}

resource "aws_iam_role" "this" {
  name = "react-app-serverlessFunctionRole-4U4GVRQHZQND"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_s3_object" "this" {
  bucket = "klofron-react-app"
  key = "react-app.zip"
  source = data.archive_file.this.output_path
  source_hash = filemd5(data.archive_file.this.output_path)
  bucket_key_enabled = false
  server_side_encryption = "AES256"
  storage_class = "STANDARD"
  content_type = "binary/octet-stream"
  tags = {}
}

data "archive_file" "this" {
  type = "zip"
  output_file_mode = "0666"
  output_path = "react-app.zip"
  source_dir = ".serverless_nextjs/default-lambda"
}