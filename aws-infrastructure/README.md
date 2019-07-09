# AWS Infrastructure

## AWS Infrastructure diagram

## First time initialisation
```
terraform init
```

##Environment Variables
### Credentials
Set the AWS credentials as we don't want these hard coded:
```
set AWS_ACCESS_KEY_ID=XYZ
set AWS_SECRET_ACCESS_KEY=abcdefghijklmnopqrstuvwxyz
```

Alternatively, other options are available:
* [Terraform AWS Authentication](https://www.terraform.io/docs/providers/aws/index.html)
