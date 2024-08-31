data "aws_acm_certificate" "this" {
  provider = aws.us-east-1
  domain = "klofron.uk"
  types = ["AMAZON_ISSUED"]
  most_recent = true
}

resource "aws_cloudfront_origin_access_identity" "this" {
  provider = aws.us-east-1
}

resource "aws_cloudfront_origin_access_control" "this" {
  provider = aws.us-east-1
  name = var.app_name
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
  provider = aws.us-east-1
  enabled = true
  price_class = "PriceClass_100"
  aliases = [var.fqdn]
  logging_config {
    bucket = "ka3-cloudfront-logs.s3.amazonaws.com"
    include_cookies = false
  }

  origin {
    domain_name = aws_s3_bucket.this.bucket_domain_name
    origin_id = "s3"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = split("/", aws_apigatewayv2_api.this.api_endpoint)[2]
    origin_id = "api-gateway"
    origin_path = "/next"
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    path_pattern = "/api/auth/*"
    cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    origin_request_policy_id = "33f36d7e-f396-46d9-90e0-52428a34d9dc"
    allowed_methods = ["GET", "HEAD", "DELETE" ,"OPTIONS" ,"PATCH" ,"POST" ,"PUT"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "api-gateway"
    min_ttl = 0
    default_ttl = 0
    max_ttl = 0
    compress = false
    viewer_protocol_policy = "https-only"
  }

  ordered_cache_behavior {
    path_pattern = "_next/static/*"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = "s3"
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
    target_origin_id = "api-gateway"
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
