const express = require("express");
const router = express.Router();

//declare aws sdk
const AWS = require("aws-sdk");

// // declare axios for making http requests
// const axios = require("axios");
// const API = "https://jsonplaceholder.typicode.com";

//config AWS
AWS.config.loadFromPath("./credential.json");

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
  let params = { Bucket: "yzhao583-new-test-bucket" };
  let urlList = [];
  s3.listObjects(params, (err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      let bucketContents = data.Contents;
      for (let i = 0; i < bucketContents.length; i++) {
        let urlParams = {
          Bucket: "yzhao583-new-test-bucket",
          Key: bucketContents[i].Key
        };
        s3.getSignedUrl("getObject", urlParams, function(err, url){
          urlList.push({ 'url': url });
        });
      }
      console.log(urlList);
      res.status(200).send(urlList);
    }
  });
});

module.exports = router;
