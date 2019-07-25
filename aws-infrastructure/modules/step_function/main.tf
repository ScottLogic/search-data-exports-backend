data "template_file" "exec_policy" {
  template = file("${path.module}/policies/${var.name}-policy.json")

  vars = var.invoked_lambda_function_arn_map
}

data "template_file" "state_machine" {
  template = file("${path.module}/definition_templates/${var.name}-definition.json")

  vars = var.invoked_lambda_function_arn_map
}

resource "aws_iam_role" "role" {
  name = "${var.name_prefix}-${var.name}-step-function-role"

  assume_role_policy = file("${path.module}/policies/step-function-role.json")

  tags = {
    Name        = "${var.name_prefix}-${var.name}-step-function-role"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_iam_policy" "policy" {
  name = "${var.name_prefix}-${var.name}-step-function-policy"

  policy = data.template_file.exec_policy.rendered
}

resource "aws_iam_role_policy_attachment" "attachment" {
  role        = aws_iam_role.role.name
  policy_arn  = aws_iam_policy.policy.arn
}

resource "aws_sfn_state_machine" "state_machine" {
  name      = var.name
  role_arn  = aws_iam_role.role.arn

  definition = data.template_file.state_machine.rendered

  tags = {
    Name        = var.name
    Environment = var.environment
    Project     = var.project
  }
}
