# Web Application Development

**Name:** Kaushik Gnanasekar \
**Email:** gnanasekar.ka@northeastern.edu \
**NUID:** 002766012

## Clone the repository
```
git clone git@github.com:kaushikgnanasekar-csye6225/webapp.git
```

## Prerequisites
- Node
- npm
- git
- MySQL
- Docker (Optional)

## Build and Deploy Instructions

## Install dependencies
```
npm install
```
## Start the node server
```
npm start
```

MySQL instance should be running for the APIs to work, \
optionally you can use the dockerized MySQl under mysql-docker and run:
```
docker-compose up -d
```

## Run Tests
```
npm test
```

## API Documentation
```
https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/spring2023-a1
https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/spring2023-a2#/Product
```

## Run migrations
```
npx sequelize-cli db:migrate
```

## Continuous Deployment







  
