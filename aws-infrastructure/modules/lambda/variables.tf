variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "elasticsearch_endpoint" {
  description = "The Elasticsearch endpoint, that's set as an environment variable for the lambdas"
}

variable "lambda_name" {
  description = "The name of the lambda we're going to create"
}

variable "source_arn" {
  description = "The URN of the resource which will invoke this lambda, so appropriate permissions can be set"
}

variable "lambda_iam_role_arn" {
  description = "The iam role to use for this lambda"
}
