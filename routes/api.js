const express = require("express");
const router = express.Router();
const async = require("async");

//declare aws sdk
const AWS = require("aws-sdk");

//config AWS
AWS.config.credentials = {
  accessKeyId: "AKIAIJ4PTT2SZP7XYOBQ",
  secretAccessKey: "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",
  region: "us-east-1"
};

// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/* GET api listing. */
router.get("/", (req, res) => {
  res.send("api works");
});

// List all buckets
router.get("/buckets", (req, res) => {
  // List buckets from the AWS
  // This should ideally be replaced with a service that connects to MongoDB
  s3.listBuckets((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data.Buckets);
    }
  });
});

// List all Objects of a bucket, create and respond with the url list.
router.get("/objects", (req, res) => {
  var params = { Bucket: "yzhao583-new-test-bucket" };
  var urlList = [];
  s3.listObjects(params, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      var bucketContents = data.Contents;
      async.each(
        bucketContents,
        (content, done) => {
          var urlParams = {
            Bucket: "yzhao583-new-test-bucket",
            Key: content.Key
          };
          s3.getSignedUrl("getObject", urlParams, (err, url) => {
            if (err) {
              res.status(500).send(err);
              return;
            } else {
              urlList.push({ 'url': url });
              done();
            }
          });
        },
        err => {
          if (err) {
            res.status(500).send(err);
            return;
          } else {
            res.status(200).send(urlList);
          }
        }
      );
    }
  });
});

module.exports = router;
