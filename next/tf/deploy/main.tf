module "this" {
  source = "../module"
  providers = {
    aws.eu-west-1 = aws.eu-west-1
    aws.us-east-1 = aws.us-east-1
  }
  app_name = "ka3"
  fqdn = "www.klofron.uk"
}