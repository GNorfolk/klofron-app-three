resource "aws_apigatewayv2_api" "main" {
    name = "nest"
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "main" {
    api_id = aws_apigatewayv2_api.main.id
    name = "api"
    auto_deploy = true
}

resource "aws_apigatewayv2_integration" "main" {
    api_id = aws_apigatewayv2_api.main.id
    integration_uri = aws_lambda_function.main.invoke_arn
    integration_type = "AWS_PROXY"
    integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "post-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "patch-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "PATCH /{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "options-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "OPTIONS /{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_domain_name" "this" {
  domain_name = "api.klofron.uk"
  domain_name_configuration {
    certificate_arn = data.aws_acm_certificate.this.arn
    endpoint_type = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "this" {
  api_id = aws_apigatewayv2_api.main.id
  domain_name = aws_apigatewayv2_domain_name.this.id
  stage = aws_apigatewayv2_stage.main.id
}
