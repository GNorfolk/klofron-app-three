terraform {
    backend "s3" {
        bucket = "norfolkgaming-tfstate"
        key = "nodejs.tfstate"
        region = "eu-west-1"
    }
}