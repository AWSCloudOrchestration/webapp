#!/bin/bash

# Get latest ami
AMI_ID=$(aws ec2 describe-images --filters "Name=name,Values=webapp-ami-*" --query 'reverse(sort_by(Images, &CreationDate))[0].ImageId' --output text)
echo "AMI ID: $AMI_ID"
# Update launch template
UPDATE_OUT=$(aws ec2 create-launch-template-version --launch-template-name $LAUNCH_TEMPLATE_NAME --source-version '$Latest' --launch-template-data '{"ImageId": "'$AMI_ID'"}' --output json)
echo "Launch template updated: $UPDATE_OUT"
# Start instance refresh
REFRESH_OUT=$(aws autoscaling start-instance-refresh --auto-scaling-group-name $AUTOSCALING_GROUP_NAME)
echo "Instance refresh started: $REFRESH_OUT"