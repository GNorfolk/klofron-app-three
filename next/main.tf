provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "norfolkgaming-tfstate"
    key = "next.tfstate"
    region = "eu-west-1"
  }
}

resource "aws_lambda_function" "this" {
  s3_bucket = aws_s3_bucket.deployment.id
  s3_key = aws_s3_object.this.id
  function_name = "react-app-serverlessFunction-6gLfMjRn66wm"
  role = aws_iam_role.this.arn
  handler = "index.handler"
  runtime = "nodejs16.x"
  publish = true
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
          "Service": [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        }
      },
    ]
  })
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.this.iam_arn]
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.this.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id
  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "this" {
  bucket = aws_s3_bucket.this.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket" "deployment" {
  bucket = "klofron-nextjs-deployment"
}

resource "aws_s3_bucket" "this" {
  bucket = "klofron-nextjs-app"
}

resource "aws_s3_object" "this" {
  bucket = aws_s3_bucket.deployment.id
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

resource "aws_cloudfront_origin_access_identity" "this" {}

resource "aws_cloudfront_origin_access_control" "this" {
  name = "react-app"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
  enabled = true
  price_class = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.this.bucket_domain_name
    origin_id                = aws_cloudfront_origin_access_identity.this.id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.this.id
    compress = false
    min_ttl = 0
    default_ttl = 3600
    max_ttl = 31536000
    forwarded_values {
      query_string = true
      headers = ["Origin"]
      cookies {
        forward = "all"
      }
    }
    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.this.qualified_arn
    }
  }

  ordered_cache_behavior {
    path_pattern = "_next/*"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.this.id
    min_ttl = 86400
    default_ttl = 86400
    max_ttl = 86400
    compress = true
    viewer_protocol_policy = "https-only"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern = "static/*"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.this.id
    min_ttl = 86400
    default_ttl = 86400
    max_ttl = 86400
    compress = true
    viewer_protocol_policy = "https-only"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern = "tests/*"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.this.id
    min_ttl = 0
    default_ttl = 0
    max_ttl = 0
    compress = false
    viewer_protocol_policy = "https-only"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations = []
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}