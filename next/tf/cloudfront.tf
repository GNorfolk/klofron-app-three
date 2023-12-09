resource "aws_cloudfront_origin_access_identity" "this" {}

resource "aws_cloudfront_origin_access_control" "this" {
  name = var.app_name
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
  enabled = true
  price_class = "PriceClass_100"
  aliases = [var.fqdn]
  logging_config {
    bucket = "ka3-cloudfront-logs.s3.amazonaws.com"
    include_cookies = false
  }

  origin {
    domain_name              = aws_s3_bucket.this.bucket_domain_name
    origin_id                = aws_cloudfront_origin_access_identity.this.id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  ordered_cache_behavior {
    path_pattern = "/api/auth/*"
    cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    origin_request_policy_id = "33f36d7e-f396-46d9-90e0-52428a34d9dc"
    allowed_methods = ["GET", "HEAD", "DELETE" ,"OPTIONS" ,"PATCH" ,"POST" ,"PUT"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.this.id
    min_ttl = 0
    default_ttl = 0
    max_ttl = 0
    compress = false
    viewer_protocol_policy = "https-only"
    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.this.qualified_arn
    }
  }

  ordered_cache_behavior {
    path_pattern = "_next/static/*"
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
        forward = "all"
      }
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
      query_string = false
      cookies {
        forward = "all"
      }
    }
    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.this.qualified_arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations = []
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.this.arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
