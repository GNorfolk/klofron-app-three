resource "aws_acm_certificate" "this" {
  domain_name = "klofron.uk"
  subject_alternative_names = ["*.klofron.uk"]
  validation_method = "DNS"
}