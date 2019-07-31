# Terraform S3 Remote Backend Setup Instructions

## Setup Terraform user

To allow Terraform to list/get/put S3 bucket objects, we need to create an AWS user.

1. In AWS IAM, select Users and click Add user.
2. Name the user "SDE-Terraform" and select the Programmatic access type.
3. In permissions, copy permissions from an existing user.
4. Add the "Project: sde" tag.
5. Finish creating the user and make a note of the access key ID and secret access key.

## Setup S3 bucket

We need an S3 bucket that is only accessible to the Terraform user we created. The bucket
will be used to retrieve and store the Terraform state file. We will add versioning to
rollback state versions if needed, and encryption at rest.

1. In AWS S3, click Create bucket.
2. Name it "search-data-exports-terraform-state" and leave the region as EU (Ireland).
3. Enable Versioning (Keep all versions of an object in the same bucket) and Default encryption (AES-256).
4. Leave default selections in Set permissions and finish creating the bucket.
5. Open the bucket and select Properties, and add relevant required tags.
6. Select the Permissions tab, and then the Bucket Policy sub-tab.
7. Copy the following bucket policy in the provided text area.
```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::032044580362:user/SDE-Terraform"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::search-data-exports-terraform-state"
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::032044580362:user/SDE-Terraform"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::search-data-exports-terraform-state/terraform_state"
        }
    ]
}
```
This will enable the Terraform user to list/get/put bucket objects.

## Setup Terraform and first init
Set the AWS credentials for the SDE-Terraform user as environment variables as below:
```
set AWS_ACCESS_KEY_ID=XYZ
set AWS_SECRET_ACCESS_KEY=abcdefghijklmnopqrstuvwxyz
```
Then, add/modify the following snippet to the `aws-infrastructure.tf` file:
```
terraform {
  backend "s3" {
    bucket = "search-data-exports-terraform-state"
    region = "eu-west-1"
    key = "terraform_state"
  }
}
```
Obtain a copy of the latest state file and run `terraform init`. Terraform will ask you whether to copy the local state to the new S3 backend or create an empty state. 