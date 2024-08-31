resource "aws_lambda_function" "this" {
  provider = aws.eu-west-1
  s3_bucket = aws_s3_bucket.deployment.id
  s3_key = aws_s3_object.this.id
  function_name = "${var.app_name}-nextjs"
  role = aws_iam_role.this.arn
  handler = "index.handler"
  runtime = "nodejs16.x"
  publish = true
  timeout = 10
  source_code_hash = filemd5("../../next.out/code.zip")
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
  role       = aws_iam_role.this.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}