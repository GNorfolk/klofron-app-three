data "local_file" "main" {
  filename = "${path.module}/event.json"
}

resource "aws_cloudwatch_event_rule" "consumer" {
    name = "schedule-nestjs-consumer-rule"
    schedule_expression = "cron(*/1 * ? * * *)"
}

resource "aws_cloudwatch_event_target" "consumer" {
    rule = aws_cloudwatch_event_rule.consumer.name
    target_id = "schedule-nestjs-consumer-target"
    arn = aws_lambda_function.main.arn
    input = data.local_file.main.content
}

resource "aws_lambda_permission" "consumer" {
    statement_id = "AllowConsumerExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.main.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.consumer.arn
}