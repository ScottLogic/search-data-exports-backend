data "template_file" "lambda_exec_policy" {
  template = file("${path.module}/policies/lambda_exec_policy.json")

  vars = {
    elasticsearch_arn = var.elasticsearch_arn
    s3_arn            = var.s3_arn
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.name_prefix}-lambda-exec-role"

  assume_role_policy = file("${path.module}/policies/lambda_exec_role.json")

  tags = {
    Name        = "${var.name_prefix}-lambda-exec-role"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${var.name_prefix}-lambda-exec-policy"

  policy = data.template_file.lambda_exec_policy.rendered
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role        = aws_iam_role.lambda_exec_role.name
  policy_arn  = aws_iam_policy.lambda_policy.arn
}

