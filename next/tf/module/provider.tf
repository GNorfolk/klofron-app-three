terraform {
  required_providers {
    aws = {
      configuration_aliases = [
        aws.eu-west-1,
        aws.us-east-1
      ]
    }
  }
}