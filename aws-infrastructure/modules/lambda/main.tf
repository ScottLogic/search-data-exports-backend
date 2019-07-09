data "archive_file" "search" {
  type        = "zip"

  source_file = "${path.module}/code/index.js"
  output_path = "${path.module}/search_lambda_function_payload.zip"
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.project}-${var.environment}-lambda-exec-role"

  assume_role_policy = file("${path.module}/policies/lambda_exec_role.json")
}

resource "aws_iam_policy" "lambda_logging" {
  name = "${var.project}-${var.environment}-lambda-exec-policy"

  policy = file("${path.module}/policies/lambda_exec_policy.json")
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role        = aws_iam_role.lambda_exec_role.name
  policy_arn  = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_function" "search_lambda" {
  filename          = data.archive_file.search.output_path
  source_code_hash  = data.archive_file.search.output_base64sha256
  function_name     = "${var.project}-${var.environment}-search"
  role              = aws_iam_role.lambda_exec_role.arn
  handler           = "index.handler"
  runtime           = "nodejs8.10"
  description       = "SDE search lambda"

  tags = {
    Name        = "${var.project}-${var.environment}-search"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.search_lambda.arn
  principal     = "apigateway.amazonaws.com"

  # The /*/*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  source_arn = "${var.api_gateway_execution_arn}/*/*/*"
}
