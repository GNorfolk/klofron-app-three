resource "aws_apigatewayv2_api" "this" {
  provider = aws.eu-west-1
  name = "next"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "this" {
  provider = aws.eu-west-1
  api_id = aws_apigatewayv2_api.this.id
  name = "$default"
  auto_deploy = false
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode({
      httpMethod = "$context.httpMethod"
      ip = "$context.identity.sourceIp"
      protocol = "$context.protocol"
      requestId = "$context.requestId"
      requestTime = "$context.requestTime"
      responseLength = "$context.responseLength"
      routeKey = "$context.routeKey"
      status = "$context.status"
    })
  }
}

resource "aws_apigatewayv2_integration" "this" {
  provider = aws.eu-west-1
  api_id = aws_apigatewayv2_api.this.id
  integration_uri = aws_lambda_function.this.invoke_arn
  integration_type = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "any" {
  provider = aws.eu-west-1
  api_id = aws_apigatewayv2_api.this.id
  route_key = "ANY /_server/{proxy+}"
  target = "integrations/${aws_apigatewayv2_integration.this.id}"
}
