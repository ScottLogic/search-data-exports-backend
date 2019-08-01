# workaround to cope with null lambda_env_map
locals {
  local_lambda_env_map  = var.lambda_env_map == null ? [] : [var.lambda_env_map]
}

# Archive lambda src to be deployed
data "archive_file" "lambda_archive_file" {
  type        = "zip"

  source_dir  = "${path.root}/../${var.lambda_name}-api/"
  output_path = "${path.module}/dist/${var.lambda_name}-api.zip"
}

resource "aws_lambda_function" "new_lambda" {
  filename          = data.archive_file.lambda_archive_file.output_path
  source_code_hash  = data.archive_file.lambda_archive_file.output_base64sha256
  function_name     = "${var.name_prefix}-${var.lambda_name}"
  role              = var.lambda_iam_role_arn
  handler           = "index.handler"
  runtime           = var.node_version
  description       = var.description

  dynamic environment {
    for_each = local.local_lambda_env_map
    content {
      variables = environment.value
    }
  }

  tags = {
    Name = "${var.name_prefix}-${var.lambda_name}"
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

resource "aws_lambda_permission" "with_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.new_lambda.arn
  principal     = "sns.amazonaws.com"
}

resource "aws_lambda_alias" "new_lambda_alias" {
  name = "DEV"
  description = "Alias to the ${aws_lambda_function.new_lambda.function_name}"
  function_name = aws_lambda_function.new_lambda.function_name
  function_version = "$LATEST"
}
