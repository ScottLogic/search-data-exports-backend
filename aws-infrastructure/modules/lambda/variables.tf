variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "api_gateway_execution_arn" {
  description = "The API Gateway execution ARN, needed to we can grant permission to allow API gateway to run our lambdas"
}

variable "elasticsearch_arn" {
  description = "The Elasticsearch arn we need to grant our lambda permission to access"
}

variable "elasticsearch_endpoint" {
  description = "The Elasticsearch endpoint, that's set as an environment variable for the lambdas"
}
