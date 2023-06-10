# resource "aws_instance" "main" {
#   ami = "ami-090b049bea4780001"
#   instance_type = "t4g.medium"
#   subnet_id = "subnet-0092be8418284d80a"
#   vpc_security_group_ids = [aws_security_group.bastion.id]
#   iam_instance_profile = aws_iam_instance_profile.bastion.id
#   user_data_base64 = "IyEvYmluL2Jhc2gKc3VkbyBhcHQgdXBkYXRlCnN1ZG8gYXB0IGluc3RhbGwgbXlzcWwtc2VydmVy"
#   tags = {
#     Name = "react-app-bastion"
#   }
# }

resource "aws_security_group" "bastion" {
  name = "react-app-bastion-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = [aws_vpc.main.cidr_block]
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  tags = {
    Name = "react-app-bastion-sg"
  }
}

resource "aws_iam_instance_profile" "bastion" {
  name = "react-app-bastion"
  role = aws_iam_role.bastion.name
}

resource "aws_iam_role" "bastion" {
  name = "react-app-bastion"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "bastion" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}