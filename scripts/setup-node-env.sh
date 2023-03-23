#!/bin/bash

# Update and upgrade
sudo yum update -y
sudo yum upgrade -y

# Install NGINX
sudo amazon-linux-extras install nginx1 -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Install CloudWatch
sudo yum install amazon-cloudwatch-agent -y
sudo systemctl enable amazon-cloudwatch-agent.service
sudo systemctl start amazon-cloudwatch-agent.service

sudo touch /opt/cloudwatch-config.json
sudo bash -c 'cat > /opt/cloudwatch-config.json <<EOF
{
  "agent": {
      "metrics_collection_interval": 10,
      "logfile": "/var/logs/amazon-cloudwatch-agent.log"
  },
  "logs": {
      "logs_collected": {
          "files": {
              "collect_list": [
                  {
                      "file_path": "/var/log/webapp/*.log",
                      "log_group_name": "csye6225",
                      "log_stream_name": "webapp"
                  }
              ]
          }
      },
      "log_stream_name": "cloudwatch_log_stream"
  },
  "metrics":{
    "namespace":"WebappMetrics",
    "metrics_collected":{
       "statsd":{}
    }
 }
} 
EOF'
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/cloudwatch-config.json \
    -s
sudo systemctl restart amazon-cloudwatch-agent.service


# NVM install
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
# Install lts
nvm install 16.19.1
nvm use 16.19.1

# Decompress webapp
mkdir /home/ec2-user/webapp
tar -xf /home/ec2-user/webapp.tar.gz -C /home/ec2-user/webapp
# npm install
npm install --omit=dev --prefix /home/ec2-user/webapp

# Create log folder with permissions
sudo mkdir -p /var/log/webapp
sudo chown -R ec2-user:ec2-user /var/log/webapp
sudo chmod -R ug+rw /var/log/webapp

# Create systemd service
sudo touch /etc/systemd/system/webapp.service
# Create var file
sudo mkdir /var/webapp/
sudo touch /var/webapp/webappvars

# Add script
sudo bash -c "cat > /etc/systemd/system/webapp.service <<EOF
[Unit]
Description=webapp

[Service]
EnvironmentFile=/var/webapp/webappvars
ExecStartPre=/bin/sleep 30
ExecStart=/home/ec2-user/.nvm/versions/node/v16.19.1/bin/node /home/ec2-user/webapp/index.js
# Restart service after 10 seconds if node service crashes
RestartSec=10
Restart=always
Restart=on-failure
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=webapp-server
User=ec2-user


[Install]
WantedBy=multi-user.target
EOF"

# Setup node server
sudo systemctl daemon-reload
sudo systemctl enable webapp.service




