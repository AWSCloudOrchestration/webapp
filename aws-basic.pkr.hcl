source "amazon-ebs" "aws-ami-basic" {
  region        = "us-east-1"
  source_ami    = "ami-0dfcb1ef8550277af"
  instance_type = "t2.micro"
  ssh_username  = "ec2-user"
  ami_name      = "packer_AWS {{timestamp}}"
}

build {
  name = "webapp-packer-basic"
  sources = [
    "amazon-ebs.aws-ami-basic"
  ]

  provisioner "file" {
    source      = "./webapp.tar.gz"
    destination = "/home/ec2-user/webapp.tar.gz"
  }

  provisioner "shell" {
    script       = "./scripts/setup-node-env.sh"
    pause_before = "10s"
    timeout      = "10s"
  }
}