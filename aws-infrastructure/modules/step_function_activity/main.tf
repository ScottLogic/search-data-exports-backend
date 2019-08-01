resource "aws_sfn_activity" "sfn_activity" {
  name = "${var.name_prefix}-${var.name}"

  tags = {
    Name        = "${var.name_prefix}-${var.name}"
    Environment = var.environment
    Project     = var.project
  }
}
