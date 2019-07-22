output "sns_success_feedback_iam_role_arn" {
  value = aws_iam_role.aws_iam_role_success.arn
}

output "sns_failure_feedback_iam_role_arn" {
  value = aws_iam_role.aws_iam_role_failed.arn
}
