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

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.sde-bucket-site.bucket_domain_name
    origin_id   = aws_s3_bucket.sde-bucket-site.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.sde-bucket-site.id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.name_prefix}-scott-logic-site"
    Environment = var.environment
    Project     = var.project
  }
}
