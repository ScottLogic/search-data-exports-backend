# dummy hello world lambda used to create initial lambda
data "archive_file" "hello_world" {
  type        = "zip"

  source_file = "${path.module}/code/index.js"
  output_path = "${path.module}/search_lambda_function_payload.zip"
}

resource "aws_lambda_function" "new_lambda" {
  filename          = data.archive_file.hello_world.output_path
  source_code_hash  = data.archive_file.hello_world.output_base64sha256
  function_name     = "${var.name_prefix}-${var.lambda_name}"
  role              = var.lambda_iam_role_arn
  handler           = "index.handler"
  runtime           = "nodejs10.x"
  description       = var.description

  environment {
    variables = var.lambda_env_map
  }

  tags = {
    Name        = "${var.name_prefix}-search"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_lambda_permission" "lambda_alias_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.new_lambda.arn
  qualifier     = aws_lambda_alias.new_lambda_alias.name

  principal     = "apigateway.amazonaws.com"

  source_arn = var.source_arn
}

resource "aws_lambda_alias" "new_lambda_alias" {
  name = "DEV"
  description = "Alias to the ${aws_lambda_function.new_lambda.function_name}"
  function_name = aws_lambda_function.new_lambda.function_name
  function_version = "$LATEST"
}
