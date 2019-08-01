terraform {
  backend "s3" {
    bucket = "search-data-exports-terraform-state"
    region = "eu-west-1"
    key = "terraform_state"
  }
}

locals {
  name_prefix             =  "${var.project}-${var.environment}"

  # The /*/*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  api_gateway_source_arn  = "${module.api-gateway.api_gateway_execution_arn}/*/*/*"
}

provider "aws" {
  region  = var.region
}

#
# Define our iam role for our lambdas - these are shared, so must be created outside of the lambda module otherwise, duplicate errors are generated
#
module "lambda_shared_policy" {
  source = "./modules/lambda_shared_policy"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  elasticsearch_arn         = module.elasticsearch.elasticsearch_arn
  s3_arn                    = module.s3-bucket.arn
}

#
# Define API gateway
#
module "api-gateway" {
  source                    = "./modules/api_gateway"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  # List of all resource method integration IDs which will be added. Used purely as a dependency, as we can't deploy the
  # API gateway until these IDs are created.
  api_method_integration_ids = [module.api-gateway-search.api_method_integration_id,
                                module.api-gateway-download-request.api_method_integration_id,
                                module.api-gateway-report-status.api_method_integration_id]
}

#
# Define our search lambda
#
module "lambda-search" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "search"
  description               = "SDE search lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {ES_SEARCH_API : module.elasticsearch.endpoint}
}

#
# Define the download request lambda
#
module "lambda-download-request" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "download-request"
  description               = "SDE download request lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {
    CSV_DOWNLOAD_REQUEST_STEP_FUNCTION_ARN  : module.step-function-csv-download-request.arn,
    OPEN_CONNECTION_ACTIVITY_ARN            : module.step-function-activity-open-connection.arn
  }
}

#
# Define the graphical report lambda
#
module "lambda-graphical-report" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "graphical-report"
  description               = "SDE generate report lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {
    ES_SEARCH_API  : module.elasticsearch.endpoint,
    S3_BUCKET_NAME : module.s3-bucket.bucket_name
  }
}

#
# Define the hybrid report lambda
#
module "lambda-hybrid-report" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "hybrid-report"
  node_version              = "nodejs8.10"
  description               = "SDE generate hybrid report lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {
    ES_SEARCH_API  : module.elasticsearch.endpoint,
    S3_BUCKET_NAME : module.s3-bucket.bucket_name
  }
}

#
# Define the report generator lambda
#
module "lambda-report-generator" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "report-generator"
  description               = "SDE report generator lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {
    ES_SEARCH_API  : module.elasticsearch.endpoint,
    S3_BUCKET_NAME : module.s3-bucket.bucket_name
  }
}

#
# Define the report status
#
module "lambda-report-status" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "report-status"
  description               = "SDE report status lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn
}

# Define the send email lambda
#
module "lambda-send-email" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "send-email"
  description               = "SDE send email lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {
    EMAIL_SENDER_ADDRESS  : "rharrington@scottlogic.com"
  }
}

#
# Create search API and link to search lambda
#
module "api-gateway-search" {
  source                    = "./modules/api_gateway_endpoint"
  api_gateway_id            = module.api-gateway.api_gateway_id
  api_gateway_parent_id     = module.api-gateway.api_gateway_root_resource_id
  api_name                  = "search"
  name_prefix               = local.name_prefix
  project                   = var.project
  lambda_invoke_arn         = module.lambda-search.invoke_arn
}

#
# Create report API and link to search lambda
#
module "api-gateway-report" {
  source                    = "./modules/api_gateway_endpoint"
  api_gateway_id            = module.api-gateway.api_gateway_id
  api_gateway_parent_id     = module.api-gateway.api_gateway_root_resource_id
  api_name                  = "report"
  name_prefix               = local.name_prefix
  project                   = var.project
  lambda_invoke_arn         = module.lambda-graphical-report.invoke_arn
}

#
# Create graphical report API and link to report API
#
module "api-gateway-graphical-report" {
  source                    = "./modules/api_gateway_endpoint"
  api_gateway_id            = module.api-gateway.api_gateway_id
  api_gateway_parent_id     = module.api-gateway-report.api_resource_id
  api_name                  = "graphical"
  name_prefix               = local.name_prefix
  project                   = var.project
  lambda_invoke_arn         = module.lambda-graphical-report.invoke_arn
}

#
# Create hybrid report API and link to report API
#
module "api-gateway-hybrid-report" {
  source                    = "./modules/api_gateway_endpoint"
  api_gateway_id            = module.api-gateway.api_gateway_id
  api_gateway_parent_id     = module.api-gateway-report.api_resource_id
  api_name                  = "hybrid"
  name_prefix               = local.name_prefix
  project                   = var.project
  lambda_invoke_arn         = module.lambda-hybrid-report.invoke_arn
}

#
# Create download API and link to download lambda
#
module "api-gateway-download-request" {
  source                    = "./modules/api_gateway_endpoint"
  api_gateway_id            = module.api-gateway.api_gateway_id
  api_gateway_parent_id     = module.api-gateway.api_gateway_root_resource_id
  api_name                  = "download-request"
  name_prefix               = local.name_prefix
  project                   = var.project
  lambda_invoke_arn         = module.lambda-download-request.invoke_arn
}

#
# Create download API and link to download lambda
#
module "api-gateway-report-status" {
  source                    = "./modules/api_gateway_endpoint"
  api_gateway_id            = module.api-gateway.api_gateway_id
  api_gateway_parent_id     = module.api-gateway.api_gateway_root_resource_id
  api_name                  = "report-status"
  name_prefix               = local.name_prefix
  project                   = var.project
  lambda_invoke_arn         = module.lambda-report-status.invoke_arn
}

#
# Create step function activity used by CSV download request
#
module "step-function-activity-open-connection" {
  source                          = "./modules/step_function_activity"
  name_prefix                     = local.name_prefix
  project                         = var.project
  environment                     = var.environment

  name                            = "OpenConnection"
}

#
# Create step function to request the download of a csv file
#
module "step-function-csv-download-request" {
  source                          = "./modules/step_function"
  name_prefix                     = local.name_prefix
  project                         = var.project
  environment                     = var.environment

  name                            = "csv-download-request"

  invoked_lambda_function_arn_map = {
    "report-generator-arn"          : module.lambda-report-generator.alias_arn
    "send-email-arn"                : module.lambda-send-email.alias_arn
    "open-connection-arn"           : module.step-function-activity-open-connection.arn
  }
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
