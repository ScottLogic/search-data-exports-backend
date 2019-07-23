
/*====
SNS Topic Delivery Status Logging
======*/
resource "aws_iam_role" "aws_iam_role_success" {
  name = "${var.name_prefix}-SNSSuccessFeedback"
  assume_role_policy = file("${path.module}/policies/sns_exec_role.json")
  tags = {
    Name        = "${var.name_prefix}-SNSSuccessFeedback"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_iam_role" "aws_iam_role_failed" {
  name = "${var.name_prefix}-SNSFailureFeedback"
  assume_role_policy = file("${path.module}/policies/sns_exec_role.json")
  tags = {
    Name        = "${var.name_prefix}-SNSFailureFeedback"
    Environment = var.environment
    Project     = var.project
  }
}

data "template_file" "exec_policy" {
  template = file("${path.module}/policies/sns_exec_policy.json")
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${var.name_prefix}-sns-exec-policy"

  policy = data.template_file.exec_policy.template
}

resource "aws_iam_role_policy_attachment" "success_policy_attachment" {
  role        = aws_iam_role.aws_iam_role_success.name
  policy_arn  = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "failed_policy_attachment" {
  role        = aws_iam_role.aws_iam_role_failed.name
  policy_arn  = aws_iam_policy.lambda_policy.arn
}