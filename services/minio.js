const Minio = require("minio");
require("dotenv").config();

let endPoint = process.env.HOST_MINIO || "localhost";
// Strip protocol and trailing paths if included
endPoint = endPoint.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
let port = process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000;
if (endPoint.includes(":")) {
  const [host, portStr] = endPoint.split(":");
  endPoint = host;
  if (!process.env.MINIO_PORT && portStr) {
    port = parseInt(portStr, 10);
  }
}

const useSSL =
  process.env.MINIO_USE_SSL === "true" ||
  process.env.MINIO_USE_SSL === true ||
  process.env.MINIO_SSL === "true";

const minioClient = new Minio.Client({
  endPoint,
  port,
  useSSL,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET || "inspektorat";

// Policy to allow read and download (public/anonymous access)
const getReadPolicy = (bucket) =>
  JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetBucketLocation", "s3:ListBucket"],
        Resource: [`arn:aws:s3:::${bucket}`],
      },
      {
        Sid: "PublicReadObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });

const initBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket '${bucketName}' created successfully`);
    } else {
      console.log(`Bucket '${bucketName}' already exists`);
    }

    await minioClient.setBucketPolicy(bucketName, getReadPolicy(bucketName));
    console.log(
      `Bucket policy for '${bucketName}' set successfully (Public Read/Download)`
    );
  } catch (err) {
    console.error("Error initializing MinIO bucket/policy:", err);
  }
};

initBucket();

minioClient.bucketName = bucketName;

module.exports = minioClient;
