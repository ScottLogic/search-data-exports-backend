resource "aws_elasticsearch_domain" "test-domain" {
  domain_name = "${var.project}-${var.environment}-es-test-domain"

  cluster_config {
    instance_type = "t2.micro.elasticsearch"
    instance_count = 1
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  //access_policies = data.template_file.access_policy.rendered

  tags = {
    Name        = "${var.project}-${var.environment}-es-test-domain"
    Environment = var.environment
    Project     = var.project
  }
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "template_file" "access_policy" {
  template = file("${path.module}/policies/elasticsearch_access_policy.json")

  vars = {
    elastic_search_arn  = "arn:aws:es:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:domain/${var.project}-${var.environment}-es-test-domain"
    account_id          = data.aws_caller_identity.current.account_id
    allowed_public_ip   = var.allowed_public_ip
  }
}

