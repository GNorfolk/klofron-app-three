terraform {
    backend "s3" {
        bucket = "norfolkgaming-tfstate"
        key = "klofron-app-three-nodejs.tfstate"
        region = "eu-west-1"
    }
}