packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "aws-ami" {
  region        = var.aws_region
  source_ami    = var.aws_source_ami
  instance_type = var.aws_instance_type
  ssh_username  = var.aws_ssh_username
  ami_name      = var.aws_ami_name
  ami_regions   = var.aws_ami_regions
  subnet_id     = var.aws_subnet_id
  ami_users     = var.aws_ami_users

  aws_polling {
    delay_seconds = var.aws_polling_delay
    max_attempts  = var.aws_max_attempts
  }

  launch_block_device_mappings {
    delete_on_termination = var.ebs_delete_on_termination
    device_name           = var.ebs_device_name
    volume_size           = var.ebs_volume_size
    volume_type           = var.ebs_volume_type
  }
}

build {
  name = "webapp-ami-build"
  sources = [
    "amazon-ebs.aws-ami"
  ]

  provisioner "file" {
    source      = "../webapp.tar.gz"
    destination = "/home/ec2-user/webapp.tar.gz"
  }

  provisioner "shell" {
    script       = "../scripts/setup-node-env.sh"
    pause_before = "10s"
    timeout      = "10s"
  }
}