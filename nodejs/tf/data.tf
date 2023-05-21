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