resource "aws_apigatewayv2_api" "main" {
    name = "backend-service"
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "main" {
    api_id = aws_apigatewayv2_api.main.id
    name = "backend-service"
    auto_deploy = true
}

resource "aws_apigatewayv2_integration" "main" {
    api_id = aws_apigatewayv2_api.main.id
    integration_uri = aws_lambda_function.main.invoke_arn
    integration_type = "AWS_PROXY"
    integration_method = "POST"
}

resource "aws_apigatewayv2_route" "main" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /users"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}