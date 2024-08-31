resource "aws_cloudwatch_log_group" "api" {
  name = "/aws/api-gateway/${var.app_name}-nextjs"
}
