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
