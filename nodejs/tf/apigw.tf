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

resource "aws_apigatewayv2_route" "people-list-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/list-people"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-list-families" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/list-families"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-list-houses" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/list-houses"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-list-family-houses" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/list-family-houses"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-list-family-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/list-family-people"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-list-house-people" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/list-house-people"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-describe-family" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/describe-family"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-describe-house" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/describe-house"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-describe-person" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /people/describe-person"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-increase-food" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /people/increase-food"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-increase-wood" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /people/increase-wood"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-increase-storage" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /people/modify-house/increase-storage"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-increase-rooms" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /people/modify-house/increase-rooms"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-create-person" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /people/create-person"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "people-create-house" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "POST /people/create-house"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}

resource "aws_apigatewayv2_route" "users-get-user" {
    api_id = aws_apigatewayv2_api.main.id
    route_key = "GET /users/get-user/{proxy+}"
    target = "integrations/${aws_apigatewayv2_integration.main.id}"
}