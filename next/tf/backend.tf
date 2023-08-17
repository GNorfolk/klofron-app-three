terraform {
  backend "s3" {
    bucket = "norfolkgaming-tfstate"
    key = "klofron-app-three-nextjs.tfstate"
    region = "eu-west-1"
  }
}
