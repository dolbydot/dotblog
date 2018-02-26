#!/bin/bash
sshpass -p $PASSWORD ssh  -p $SSH_PORT -o StrictHostKeyChecking=no -T $DEPLOY_USER@$DEPLOY_SERVER << EOF
docker login -u $DOCKER_USERID -p $DOCKERPASSWD
docker rmi $DOCKER_USERID/$APP_NAME || true
docker stop $APP_NAME || true
docker rm $APP_NAME || true
docker pull $DOCKER_USERID/$APP_NAME
docker run -d --name $APP_NAME -p 9999:9999 $DOCKER_USERID/$APP_NAME
EOF
