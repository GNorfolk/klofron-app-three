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

resource "aws_apigatewayv2_route" "options-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "OPTIONS /{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}