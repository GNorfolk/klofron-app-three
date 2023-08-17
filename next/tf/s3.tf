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
  bucket = "${var.app_name}-nextjs-deployment"
}

resource "aws_s3_bucket" "this" {
  bucket = "${var.app_name}-nextjs-app"
}

resource "aws_s3_object" "this" {
  bucket = aws_s3_bucket.deployment.id
  key = "${var.app_name}-nextjs.zip"
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
  output_path = "${var.app_name}-nextjs.zip"
  source_dir = "../.serverless_nextjs/default-lambda"
}
