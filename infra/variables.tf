variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "EC2 Key Pair Name"
  default     = "hospital-key"
}

variable "docker_image" {
  description = "Docker Hub Image Name"
  default     = "aksah22/hospital-app:latest"
}

variable "mongodb_uri" {
  description = "MongoDB Atlas Connection URI"
  type        = string
}

variable "session_secret" {
  description = "Session Secret for Node App"
  default     = "mysecretkey"
}
