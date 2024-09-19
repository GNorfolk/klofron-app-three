module "this" {
  source  = "nhs-england-tools/opennext/aws"
  version = "1.0.6" # Use the latest release from https://github.com/nhs-england-tools/terraform-aws-opennext/releases

  prefix              = "ka3"                               # Prefix for all created resources
  opennext_build_path = "../../.open-next"                  # Path to your .open-next folder
  hosted_zone_id      = data.aws_route53_zone.this.zone_id  # The Route53 hosted zone ID for your domain name

  cloudfront = {
    aliases             = ["www.klofron.uk"]                        # Your domain name
    acm_certificate_arn = data.aws_acm_certificate.this.arn         # The ACM (SSL) certificate for your domain
  }
}
