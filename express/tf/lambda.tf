resource "aws_lambda_function" "main" {
    filename = "build/publishBookReview.zip"
    handler = "index.lambda_handler"
    runtime = "python3.8"
    function_name = "backend-service"
    role = aws_iam_role.main.arn
    timeout = 30
}

resource "aws_lambda_permission" "main" {
    statement_id = "AllowExecutionFromAPIGateway"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.main.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}