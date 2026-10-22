output "public_ip" {
  value = aws_instance.hospital_ec2.public_ip
  description = "Public IP of the hospital EC2"
}

output "public_dns" {
  value = aws_instance.hospital_ec2.public_dns
}
