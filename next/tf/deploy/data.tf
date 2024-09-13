data "aws_route53_zone" "this" {
  provider = aws.eu-west-1
  name = "klofron.uk"
  private_zone = false
}

data "aws_acm_certificate" "this" {
  provider = aws.us-east-1
  domain = "klofron.uk"
  types = ["AMAZON_ISSUED"]
  most_recent = true
}