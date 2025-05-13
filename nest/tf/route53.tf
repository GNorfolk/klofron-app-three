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
