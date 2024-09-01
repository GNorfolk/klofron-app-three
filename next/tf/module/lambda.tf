resource "aws_lambda_function" "this" {
  provider = aws.eu-west-1
  s3_bucket = aws_s3_bucket.deployment.id
  s3_key = aws_s3_object.this.id
  function_name = "${var.app_name}-nextjs"
  layers = [aws_lambda_layer_version.this.arn]
  role = aws_iam_role.this.arn
  handler = "index.handler"
  runtime = "nodejs16.x"
  publish = true
  timeout = 10
  source_code_hash = filemd5("../../next.out/code.zip")
  environment {
    variables = {
      NEXTJS_LAMBDA_BASE_PATH = "/_server"
      NEXTAUTH_URL = "https://www.klofron.uk"
      NEXT_PUBLIC_API_HOST = "https://api.klofron.uk"
    }
  }
}

resource "aws_lambda_layer_version" "this" {
  provider = aws.eu-west-1
  s3_bucket = aws_s3_bucket.deployment.id
  s3_key = aws_s3_object.that.id
  layer_name = "${var.app_name}-nextjs-deps"
  compatible_runtimes = ["nodejs16.x"]
  source_code_hash = filemd5("../../next.out/dependenciesLayer.zip")
}

resource "aws_lambda_permission" "this" {
    statement_id = "AllowExecutionFromAPIGateway"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.this.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

resource "aws_iam_role" "this" {
  provider = aws.eu-west-1
  name = "${var.app_name}-nextjs-lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          "Service": [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com",
            "logger.cloudfront.amazonaws.com"
          ]
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "this" {
  provider = aws.eu-west-1
  role = aws_iam_role.this.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}