terraform {
    backend "s3" {
        bucket = "norfolkgaming-tfstate"
        key = "react-app.tfstate"
        region = "eu-west-1"
    }
}