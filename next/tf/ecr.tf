resource "aws_ecr_repository" "this" {
  name = "klofron-app-three"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = false
  }
}