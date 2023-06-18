data "aws_route53_zone" "this" {
  name = "klofron.uk"
  private_zone = false
}

resource "aws_route53_record" "validation" {
  zone_id = data.aws_route53_zone.this.zone_id
  name = "_cb38710c3d02f35dfc40cf526eb9f7f9"
  type = "CNAME"
  records = ["_6d264440e383229843f89ea01f1ac7c0.yghrkwvzvz.acm-validations.aws."]
  ttl = 60
}

resource "aws_route53_record" "this" {
  zone_id = data.aws_route53_zone.this.zone_id
  name = var.fqdn
  type = "CNAME"
  records = [aws_cloudfront_distribution.this.domain_name]
  ttl = 60
}