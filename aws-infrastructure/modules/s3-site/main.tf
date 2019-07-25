locals {
  bucket_name = "${var.name_prefix}-scott-logic-site"
}

data "template_file" "bucket_policy" {
  template = file("${path.module}/policies/bucket_policy.json")
  vars = {
    bucket_name = local.bucket_name
  }
}

resource "aws_s3_bucket" "sde-bucket-site" {
  bucket = local.bucket_name
  acl = "public-read"
  policy = data.template_file.bucket_policy.rendered

  website {
    index_document = "index.html"
  }

  tags = {
    Name        = "${var.name_prefix}-scott-logic-site"
    Environment = var.environment
    Project     = var.project
  }
}
