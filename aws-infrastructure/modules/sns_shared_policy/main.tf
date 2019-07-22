
/*====
SNS Topic Delivery Status Logging
======*/
resource "aws_iam_role" "aws_iam_role_success" {
  name = "${var.name_prefix}-SNSSuccessFeedback"
  assume_role_policy = file("${path.module}/policies/feedback_policy.json")
  tags = {
    Name        = "${var.name_prefix}-SNSSuccessFeedback"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_iam_role" "aws_iam_role_failed" {
  name = "${var.name_prefix}-SNSFailureFeedback"
  assume_role_policy = file("${path.module}/policies/feedback_policy.json")
  tags = {
    Name        = "${var.name_prefix}-SNSFailureFeedback"
    Environment = var.environment
    Project     = var.project
  }
}
