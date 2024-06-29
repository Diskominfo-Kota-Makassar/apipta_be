const Minio = require("minio");
require("dotenv").config();

const minioClient = new Minio.Client({
  endPoint: process.env.HOST_MINIO,
  port: 8899,
  useSSL: false, // or true if you're using SSL
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET;

// Ensure the bucket exists
const policy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucketName}/*`],
    },
  ],
};

minioClient.setBucketPolicy(bucketName, JSON.stringify(policy), (err) => {
  if (err) {
    return console.log("Error setting bucket policy:", err);
  }
  console.log("Bucket policy set successfully");
});
minioClient.bucketExists(bucketName, (err) => {
  if (err) {
    minioClient.makeBucket(bucketName, "us-east-1", (err) => {
      if (err) return console.log(err);
      console.log("Bucket created successfully");
    });
  }
});

module.exports = minioClient;
