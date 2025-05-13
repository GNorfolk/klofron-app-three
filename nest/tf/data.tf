data "aws_vpc" "main" {
  id = "vpc-0d0a37d8793a350ea"
}

data "aws_subnet" "main" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  filter {
    name = "map-public-ip-on-launch"
    values = [false]
  }
  filter {
    name = "availability-zone"
    values = ["eu-west-1a"]
  }
}

data "aws_secretsmanager_secret" "rds" {
  name = "klofron-app-three-rds-db"
}

data "aws_secretsmanager_secret_version" "rds" {
  secret_id = data.aws_secretsmanager_secret.rds.id
}

data "aws_acm_certificate" "this" {
  domain = "klofron.uk"
  types = ["AMAZON_ISSUED"]
  most_recent = true
}

data "aws_route53_zone" "this" {
  name = "klofron.uk"
  private_zone = false
}
