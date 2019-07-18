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
}

#
# Define API gateway
#
module "api-gateway" {
  source                    = "./modules/api_gateway"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment

  # list of all resource id's which will be added. Used purely as a dependency, as we can't deploy the API gateway until
  # the resource id's are created.
  api_resource_ids          = [module.api-gateway-search.api_resource_id]
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
# Create download request SNS topic
#
module "sns-download-request-topic" {
  source                          = "./modules/sns"
  name_prefix                     = local.name_prefix
  project                         = var.project
  environment                     = var.environment
  sns_topic_name                  = "download-requests-topic"
  sns_topic_subscription_protocol = "lambda"
  sns_topic_subscription_endpoint = module.lambda-generate-report.arn
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

  lambda_env_map            = {DOWNLOAD_REQUESTS_SNS_TOPIC : module.sns-download-request-topic.topic_arn}
}

#
# Define the generate report lambda
#
module "lambda-generate-report" {
  source                    = "./modules/lambda"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  lambda_name               = "generate-report"
  description               = "SDE generate report lambda"

  lambda_iam_role_arn       = module.lambda_shared_policy.lambda_iam_role_arn

  source_arn                = local.api_gateway_source_arn

  lambda_env_map            = {ES_SEARCH_API : module.elasticsearch.endpoint}
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
# Create search API and link to search lambda
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

module "elasticsearch" {
  source                    = "./modules/elasticsearch"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
  allowed_public_ip         = var.allowed_public_ip
}
