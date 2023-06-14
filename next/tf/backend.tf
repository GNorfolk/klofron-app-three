terraform {
  backend "s3" {
    bucket = "norfolkgaming-tfstate"
    key = "next.tfstate"
    region = "eu-west-1"
  }
}
