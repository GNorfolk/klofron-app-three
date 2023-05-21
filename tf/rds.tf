resource "aws_db_instance" "main" {
  identifier = "react-app"
  allocated_storage = 10
  engine = "mysql"
  engine_version = "8.0"
  instance_class = "db.t4g.micro"
  username = "root"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot = true
  db_subnet_group_name = aws_db_subnet_group.main.name
  apply_immediately = true
  availability_zone = "eu-west-1a"
  storage_type = "gp2"
  manage_master_user_password = true
  vpc_security_group_ids = [aws_security_group.rds.id]
}

resource "aws_db_subnet_group" "main" {
  name = "react-app"
  subnet_ids = [aws_subnet.private-1a.id, aws_subnet.private-1b.id]
}

resource "aws_security_group" "rds" {
  name = "react-app-rds-sg"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port        = 3306
    to_port          = 3306
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
    Name = "react-app-rds-sg"
  }
}