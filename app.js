require('dotenv').config();
const express = require("express");
const request = require("request");
const https = require("https");
const mailChimp = require("@mailchimp/mailchimp_marketing");
const app = express();

mailChimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us14",
});

app.use(express.static("public")); 
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const lname = req.body.Lname;
  const fname = req.body.Fname;
  const email = req.body.Email;
  console.log(fname + " " + lname + " :email: " + email);
 

  const run = async () => {
    try {
      const response = await mailChimp.lists.batchListMembers("75e2342e6d", {
        members: [{
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: fname,
            LNAME: lname
          }
        }]
      });
      console.log(response);
      
      res.sendFile(__dirname + "/success.html");

    } catch (err) {
      console.log(err);
      res.sendFile(__dirname + "/failure.html");

    }

  };
  run();

});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.post('/success', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port:3000");
})

