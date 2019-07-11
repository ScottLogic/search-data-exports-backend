variable "name_prefix" {
  description = "Prefix to use when naming resources"
}

variable "project" {
  description = "The name of the project"
}

variable "environment" {
  description = "The name of the environment we're creating, i.e prod, uat, dev etc."
}

variable "allowed_public_ip" {
  description = "A public IP which is allowed access to the cluster for maintenance purposes"
}


