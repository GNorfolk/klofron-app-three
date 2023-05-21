resource "aws_vpc" "main" {
  cidr_block = "10.10.0.0/16"
  tags = {
    Name = "main"
  }
}

resource "aws_subnet" "public-1a" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.10.0.0/24"
  map_public_ip_on_launch = true
  availability_zone = "eu-west-1a"
  tags = {
    Name = "public-1a"
  }
}

resource "aws_subnet" "public-1b" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.10.10.0/24"
  map_public_ip_on_launch = true
  availability_zone = "eu-west-1b"
  tags = {
    Name = "public-1b"
  }
}

resource "aws_subnet" "private-1a" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.10.100.0/24"
  map_public_ip_on_launch = false
  availability_zone = "eu-west-1a"
  tags = {
    Name = "private-1a"
  }
}

resource "aws_subnet" "private-1b" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.10.110.0/24"
  map_public_ip_on_launch = false
  availability_zone = "eu-west-1b"
  tags = {
    Name = "private-1b"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id  = aws_vpc.main.id
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "public-1a" {
  subnet_id       = aws_subnet.public-1a.id
  route_table_id  = aws_route_table.main.id
}

resource "aws_route_table_association" "public-1b" {
  subnet_id       = aws_subnet.public-1b.id
  route_table_id  = aws_route_table.main.id
}

resource "aws_route_table_association" "private-1a" {
  subnet_id       = aws_subnet.private-1a.id
  route_table_id  = aws_route_table.main.id
}

resource "aws_route_table_association" "private-1b" {
  subnet_id       = aws_subnet.private-1b.id
  route_table_id  = aws_route_table.main.id
}