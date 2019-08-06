terraform {
  backend "s3" {
    bucket = "search-data-exports-terraform-state"
    region = "eu-west-1"
    key = "terraform_state"
  }
}

locals {
  name_prefix             =  "${var.project}-${var.environment}"
}

provider "aws" {
  region  = var.region
}

module "elasticsearch" {
  source                    = "./modules/elasticsearch"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  allowed_public_ip         = var.allowed_public_ip
}

module "s3-bucket" {
  source                    = "./modules/s3"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
}

module "s3-bucket-site" {
  source                    = "./modules/s3-site"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
}

module "ssm_es_endpoint_parameter" {
  source                    = "./modules/ssm_parameter"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  name = "elasticsearch-endpoint"
  description = "The Elastic Search endpoint for the SDE project"
  type = "String"
  value = module.elasticsearch.endpoint
}

module "ssm_s3_bucket_name_parameter" {
  source                    = "./modules/ssm_parameter"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  name = "s3-bucket-name"
  description = "The S3 bucket name for the SDE project"
  type = "String"
  value = module.s3-bucket.bucket_name
}
