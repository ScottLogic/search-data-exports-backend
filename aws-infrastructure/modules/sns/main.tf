/*====
SNS Topic
======*/
resource "aws_sns_topic" "new_sns_topic" {
  name = "${var.name_prefix}-${var.sns_topic_name}"
  tags = {
    Name        = "${var.name_prefix}-${var.sns_topic_name}"
    Environment = var.environment
    Project     = var.project
  }
  lambda_success_feedback_role_arn    = var.sns_success_feedback_role_arn
  lambda_success_feedback_sample_rate = 100
  lambda_failure_feedback_role_arn    = var.sns_failure_feedback_role_arn
}

/*====
SNS Topic Subscription
======*/
resource "aws_sns_topic_subscription" "new_sns_topic_subscription" {
  count     = length(var.sns_topic_subscription_endpoints)
  endpoint  = var.sns_topic_subscription_endpoints[count.index]
  topic_arn = aws_sns_topic.new_sns_topic.arn
  protocol  = var.sns_topic_subscription_protocol
}
