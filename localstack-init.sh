#!/bin/bash

# Create S3 bucket for LocalStack
awslocal --endpoint-url=http://localhost:4566 s3 mb s3://ltis3storage
