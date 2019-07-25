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
# Define our iam roles for our SNS topic
#
module "sns_shared_policy" {
  source                    = "./modules/sns_shared_policy"
  name_prefix               = local.name_prefix
  project                   = var.project
  environment               = var.environment
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
                                module.api-gateway-download-request.api_method_integration_id]
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
module "sns-download-requests-topic" {
  source                           = "./modules/sns"
  name_prefix                      = local.name_prefix
  project                          = var.project
  environment                      = var.environment
  sns_topic_name                   = "download-requests-topic"
  sns_topic_subscription_protocol  = "lambda"
  sns_topic_subscription_endpoints = [module.lambda-generate-report.arn]
  sns_success_feedback_role_arn    = module.sns_shared_policy.sns_success_feedback_iam_role_arn
  sns_failure_feedback_role_arn    = module.sns_shared_policy.sns_failure_feedback_iam_role_arn
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

  lambda_env_map            = {DOWNLOAD_REQUESTS_SNS_TOPIC : module.sns-download-requests-topic.topic_arn}
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

  lambda_env_map            = {
                                ES_SEARCH_API  : module.elasticsearch.endpoint,
                                S3_BUCKET_NAME : module.s3-bucket.bucket_name
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
# Create step function to create and email report
#
module "step-function-create-and-email-report" {
  source                          = "./modules/step_function"
  name_prefix                     = local.name_prefix
  project                         = var.project
  environment                     = var.environment

  name                            = "create-and-email-csv-report"

  invoked_lambda_function_arn_map = {
    "report-generator-arn"      : module.lambda-report-generator.alias_arn,
    "send-email-arn"            : module.lambda-send-email.alias_arn
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
