output "arn" {
  value = aws_s3_bucket.sde-bucket-site.arn
}

output "bucket_name" {
  value = aws_s3_bucket.sde-bucket-site.bucket
}

output "site_endpoint" {
  value = aws_s3_bucket.sde-bucket-site.website_endpoint
}
