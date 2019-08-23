# search-data-exports-backend

### Notes - 23/08/2019

The serverless dev dependency has been locked at version 1.49.0 as the latest version (1.50.0) currently causes the following error output:
```
Serverless: Installing dependencies for custom CloudFormation resources...
EMFILE: too many open files ...
```
Until a patch is released for the Serverless Framework the version will remain fixed at 1.49.0
