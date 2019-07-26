resource "aws_s3_bucket" "sde-bucket" {
  bucket = "${var.name_prefix}-scott-logic"
  acl = "public-read"

  lifecycle_rule {
    id = "${var.name_prefix}-one-day-life"
    enabled = true

    expiration {
      days = "1"
    }
  }

  tags = {
    Name = "${var.name_prefix}-scott-logic"
    Environment = var.environment
    Project     = var.project
  }
}


