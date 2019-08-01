resource "aws_ssm_parameter" "sde_ssm_parameter" {
  type = var.type
  description = var.description
  name = "${var.name_prefix}-${var.name}"
  value = var.value
  overwrite = true

  tags = {
    Name = "${var.name_prefix}-scott-logic"
    Environment = var.environment
    Project = var.project
  }
}
