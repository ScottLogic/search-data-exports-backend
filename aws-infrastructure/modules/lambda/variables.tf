variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "lambda_name" {
  description = "The name of the lambda we're going to create"
}

variable "description" {
  description = "The description of the lambda we're going to create"
}

variable "lambda_env_map" {
  type = "map"
  description = "A map containing the lambda's environment variables"
}

variable "source_arn" {
  description = "The ARN of the resource which will invoke this lambda, so appropriate permissions can be set"
}

variable "lambda_iam_role_arn" {
  description = "The iam role to use for this lambda"
}

variable "node_version" {
  description = "The version of node to use"
  default = "nodejs10.x"
}
