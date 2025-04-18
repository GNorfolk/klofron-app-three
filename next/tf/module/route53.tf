data "aws_route53_zone" "this" {
  provider = aws.eu-west-1
  name = "klofron.uk"
  private_zone = false
}

resource "aws_route53_record" "this" {
  provider = aws.eu-west-1
  zone_id = data.aws_route53_zone.this.zone_id
  name = var.fqdn
  type = "CNAME"
  records = [aws_cloudfront_distribution.this.domain_name]
  ttl = 60
}