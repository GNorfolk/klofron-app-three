data "aws_route53_zone" "this" {
  name = "klofron.uk"
  private_zone = false
}

resource "aws_acm_certificate" "this" {
  domain_name = "klofron.uk"
  subject_alternative_names = ["*.klofron.uk"]
  validation_method = "DNS"
}

resource "aws_apigatewayv2_domain_name" "this" {
  domain_name = "klofron-app-three-api.klofron.uk"
  domain_name_configuration {
    certificate_arn = aws_acm_certificate.this.arn
    endpoint_type = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "example" {
  api_id = aws_apigatewayv2_api.main.id
  domain_name = aws_apigatewayv2_domain_name.this.id
  stage = aws_apigatewayv2_stage.main.id
}

resource "aws_route53_record" "this" {
  name = aws_apigatewayv2_domain_name.this.domain_name
  type = "A"
  zone_id = data.aws_route53_zone.this.zone_id
  alias {
    name = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].target_domain_name
    zone_id = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}