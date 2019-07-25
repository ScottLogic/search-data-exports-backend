output "arn" {
  value = aws_lambda_function.new_lambda.arn
}

output "alias_arn" {
  value = aws_lambda_alias.new_lambda_alias.arn
}

output "invoke_arn" {
  value = aws_lambda_alias.new_lambda_alias.invoke_arn
}

