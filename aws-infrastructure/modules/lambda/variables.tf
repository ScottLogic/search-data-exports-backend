variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "api_gateway_execution_arn" {
  description = "The API Gateway execution ARN, needed to we can grant permission to allow API gateway to run our lambdas"
}
