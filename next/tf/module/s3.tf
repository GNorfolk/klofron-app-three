resource "aws_s3_bucket_policy" "this" {
  provider = aws.eu-west-1
  bucket = aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  provider = aws.eu-west-1
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
  provider = aws.eu-west-1
  bucket = aws_s3_bucket.this.id
  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "this" {
  provider = aws.eu-west-1
  bucket = aws_s3_bucket.this.id
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "this" {
  provider = aws.eu-west-1
  bucket = aws_s3_bucket.this.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket" "deployment" {
  provider = aws.eu-west-1
  bucket = "${var.app_name}-nextjs-deployment"
}

resource "aws_s3_bucket" "this" {
  provider = aws.eu-west-1
  bucket = "${var.app_name}-nextjs-app"
}

resource "aws_s3_object" "this" {
  provider = aws.eu-west-1
  bucket = aws_s3_bucket.deployment.id
  key = "${var.app_name}-nextjs.zip"
  source = "../../next.out/code.zip"
  source_hash = filemd5("../../next.out/code.zip")
  bucket_key_enabled = false
  server_side_encryption = "AES256"
  storage_class = "STANDARD"
  content_type = "binary/octet-stream"
  tags = {}
}