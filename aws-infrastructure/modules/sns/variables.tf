variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "sns_topic_name" {
  description = "The name of the SNS topic we're creating"
}

variable "sns_topic_subscription_protocol" {
  description = "The protocol of the topic subscription e.g. sqs, sms, lambda"
}

variable "sns_topic_subscription_endpoints" {
  description = "The endpoints of the topic subscribers"
}

variable "sns_success_feedback_role_arn" {
  description = "The IAM role for success message delivery feedback"
}

variable "sns_failure_feedback_role_arn" {
  description = "The IAM role for failed message delivery feedback"
}