provider "aws" {
  region = var.region
}

resource "aws_key_pair" "hospital_key" {
  key_name   = "hospital-key"
  public_key = file("C:/keys/hospital-key.pub")
}




data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_security_group" "hospital_sg" {
  name = "hospital-app-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "hospital_ec2" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.hospital_key.key_name
  vpc_security_group_ids = [aws_security_group.hospital_sg.id]

user_data = <<-EOT
  #!/bin/bash
  yum update -y
  amazon-linux-extras install docker -y
  systemctl start docker
  systemctl enable docker

  docker pull aksah22/hospital-app:latest

  docker run -d -p 80:3000 \
    -e MONGODB_URI="mongodb+srv://hospitaluser:aman123@cluster0.hmpxsho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" \
    -e SESSION_SECRET="mysecretkey" \
    --name hospital-app \
    aksah22/hospital-app:latest
EOT


  tags = {
    Name = "Hospital-App-Server"
  }
}
