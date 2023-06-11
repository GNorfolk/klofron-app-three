resource "aws_apigatewayv2_api" "main" {
    name = "api"
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

resource "aws_apigatewayv2_route" "users" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /users"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "health-check" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /health-check"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "users-get-ids" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /users/get-ids"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "users-get-user" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /users/get-user/{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}