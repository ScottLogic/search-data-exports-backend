variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "api_gateway_id" {
  description = "The API gateway id we're adding an endpoint to"
}

variable "api_gateway_parent_id" {
  description = "The API gateway parent resource id we're adding the endpoint under"
}

variable "lambda_invoke_arn" {
  description = "The arn of the lambda this API will call"
}

variable "api_name" {
  description = "The name of the API"
}
