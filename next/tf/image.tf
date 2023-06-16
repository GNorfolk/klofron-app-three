resource "aws_lambda_function" "image" {
  function_name = "react-app-image-function"
  filename = "index.zip"
  role = aws_iam_role.image.arn
  handler = "index.handler"
  runtime = "nodejs16.x"
  timeout = 60
  source_code_hash = data.archive_file.image.output_base64sha256
  environment {
    variables = {
      originalImageBucketName = aws_s3_bucket.original.id
      transformedImageBucketName = aws_s3_bucket.transformed.id
      transformedImageCacheTTL = "max-age=31622400"
      secretKey = "test"
      logTiming = "false"
    }
  }
}

resource "aws_lambda_function_url" "image" {
  function_name = aws_lambda_function.image.function_name
  authorization_type = "NONE"
}

data "archive_file" "image" {
  type = "zip"
  source_dir = "image/"
  output_path = "index.zip"
}

resource "aws_s3_bucket" "original" {
  bucket = "klofron-nextjs-image-original"
}

resource "aws_s3_bucket_public_access_block" "original" {
  bucket = aws_s3_bucket.original.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "transformed" {
  bucket = "klofron-nextjs-image-transformed"
}

resource "aws_s3_bucket_lifecycle_configuration" "transformed" {
  bucket = aws_s3_bucket.transformed.id
  rule {
    id = "rule-1"
    status = "Enabled"
    expiration {
      days = 90
    }
  }
}

data "aws_iam_policy_document" "image" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.original.arn}/*"
    ]
  }
  statement {
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "${aws_s3_bucket.transformed.arn}/*"
    ]
  }
}

resource "aws_iam_role" "image" {
  name = "react-app-image-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
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

resource "aws_iam_role_policy" "image" {
  role = aws_iam_role.image.name
  policy = data.aws_iam_policy_document.image.json
}

resource "aws_cloudfront_function" "this" {
  name = "url-rewrite"
  runtime = "cloudfront-js-1.0"
  publish = true
  code = file("${path.module}/image/url-rewrite.js")
}