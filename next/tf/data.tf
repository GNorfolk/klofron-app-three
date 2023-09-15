data "aws_acm_certificate" "this" {
    domain = "klofron.uk"
    types = ["AMAZON_ISSUED"]
    most_recent = true
}