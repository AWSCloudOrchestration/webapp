
packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "aws-ami" {
  region        = "us-east-1"
  source_ami    = "ami-0dfcb1ef8550277af"
  instance_type = "t2.micro"
  ssh_username  = "ec2-user"
  ami_name      = "packer_AWS {{timestamp}}"
  // vpc_id        = "vpc-03b5562b7381f686a"
  // subnet_id     = "subnet-0719ad23f030b6185"

  // aws_regions = {
  //   "us-east-1",
  //   "us-east-2"
  // }

  // aws_polling {
  //   delay_seconds = 120
  //   max_attempts  = 70
  // }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  name = "webapp-packer"
  sources = [
    "amazon-ebs.aws-ami"
  ]

  // provisioner "file" {
  //   source      = "./webapp.tar.gz"
  //   destination = "/home/ec2-user/webapp.tar.gz"
  // }

  // provisioner "shell" {
  //   script       = "./scripts/setup-node-env.sh"
  //   pause_before = "10s"
  //   timeout      = "10s"
  // }
}
