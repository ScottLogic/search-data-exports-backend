/*====
SNS Topic
======*/
resource "aws_sns_topic" "new_sns_topic" {
  name = var.sns_topic_name
  tags = {
    Name        = "${var.name_prefix}-search"
    Environment = var.environment
    Project     = var.project
  }
}

/*====
SNS Topic Subscription
======*/
resource "aws_sns_topic_subscription" "new_sns_topic_subscription" {
  topic_arn = aws_sns_topic.new_sns_topic.arn
  protocol  = var.sns_topic_subscription_protocol
  endpoint  = var.sns_topic_subscription_endpoint
}
