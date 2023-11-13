# resource "aws_apigatewayv2_api" "main" {
#     name = "nest"
#     protocol_type = "HTTP"
# }

data "aws_apigatewayv2_api" "main" {
    api_id = "2ya1hiwlrc"
}

# resource "aws_apigatewayv2_stage" "main" {
#     api_id = data.aws_apigatewayv2_api.main.id
#     name = "api"
#     auto_deploy = true
# }

resource "aws_apigatewayv2_integration" "main" {
    api_id = data.aws_apigatewayv2_api.main.id
    integration_uri = aws_lambda_function.main.invoke_arn
    integration_type = "AWS_PROXY"
    integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get-people" {
    api_id = data.aws_apigatewayv2_api.main.id
    route_key = "GET /v2/{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "post-people" {
    api_id = data.aws_apigatewayv2_api.main.id
    route_key = "POST /v2/{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "options-people" {
    api_id = data.aws_apigatewayv2_api.main.id
    route_key = "OPTIONS /v2/{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}