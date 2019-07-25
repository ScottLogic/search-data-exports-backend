variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "name" {
  description = "The name of this step function"
}

variable "invoked_lambda_function_arn_map" {
  type = "map"
  description = "A map of lambda names and associated arn's. Used for roles and definition templates"
}
