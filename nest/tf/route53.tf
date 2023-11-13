data "aws_route53_zone" "this" {
  name = "klofron.uk"
  private_zone = false
}

resource "aws_apigatewayv2_domain_name" "this" {
  domain_name = "nest.klofron.uk"
  domain_name_configuration {
    certificate_arn = data.aws_acm_certificate.this.arn
    endpoint_type = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "this" {
  api_id = data.aws_apigatewayv2_api.main.id
  domain_name = aws_apigatewayv2_domain_name.this.id
  # stage = aws_apigatewayv2_stage.main.id
  stage = "api"
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