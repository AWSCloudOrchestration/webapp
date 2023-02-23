variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_source_ami" {
  type = string
}

variable "aws_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "aws_ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "aws_ami_name" {
  type    = string
  default = "webapp-ami-{{timestamp}}"
}

variable "aws_polling_delay" {
  type    = number
  default = 120
}

variable "aws_max_attempts" {
  type    = number
  default = 20
}

variable "ebs_delete_on_termination" {
  type    = bool
  default = true
}

variable "ebs_device_name" {
  type    = string
  default = "/dev/xvda"
}

variable "ebs_volume_size" {
  type    = number
  default = 8
}

variable "ebs_volume_type" {
  type    = string
  default = "gp2"
}

variable "aws_ami_regions" {
  type    = list(string)
  default = []
}

variable "aws_subnet_id" {
  type = string
}

variable "aws_ami_users" {
  type = list(string)
}

variable "app_file_source" {
  type    = string
  default = "../webapp.tar.gz"
}

variable "app_file_destination" {
  type    = string
  default = "/home/ec2-user/webapp.tar.gz"
}

variable "app_setup_script_file" {
  type    = string
  default = "../scripts/setup-node-env.sh"
}

variable "shell_pause_before" {
  type    = string
  default = "10s"
}

variable "shell_timeout" {
  type    = string
  default = "10s"
}

