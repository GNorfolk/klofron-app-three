terraform {
    backend "s3" {
        bucket = "norfolkgaming-tfstate"
        key = "klofron-app-three-nestjs.tfstate"
        region = "eu-west-1"
    }
}