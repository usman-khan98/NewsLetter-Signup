const express = require("express");
const request = require("request");
const https = require("https");
const mailChimp = require("@mailchimp/mailchimp_marketing");
const app = express();

mailChimp.setConfig({
  apiKey: "8c3eddb2712175d65a24c9a91c65ad98-us14",
  server: "us14",
});

app.use(express.static("public")); // to create public folder which is send automatically, that contains css file, images or bootstrap //
app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const lname = req.body.Lname;
  const fname = req.body.Fname;
  const email = req.body.Email;
  console.log(fname + " " + lname + " :email: " + email);
  //dr angela method outdated on mailchimp//

  //     const data1 = {
  //       members: [
  //         {
  //           email_address: email,
  //           status: "subscribed",
  //           merge_fields: {
  //             FNAME: fname,
  //             LNAME: lname
  //           }
  //         }
  //       ]
  //     }
  //
  //   var jsonData = JSON.stringify(data1);
  //
  //   const url = "https://us14.api.mailchimp.com/3.0/lists/75e2342e6d";
  //
  //   const options = {
  //     method: "POST",
  //     auth: "usman1:8c3eddb2712175d65a24c9a91c65ad98-us14"
  //   };
  //
  //   const request = https.request(url, options, function(responce){
  //     responce.on("data", function(data){
  //       console.log(JSON.parse(data));
  //     })
  //    request.write(jsonData);
  //    request.end();
  //   })
  // });

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
      // unable to parse responce to find status code so used try catch to get same result//
      res.sendFile(__dirname + "/success.html");

    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");

    }

  };
  run();

});
//if more than 2 routes define your own route path, but dont give file name as route//

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.post('/success', function (req, res) {
  res.redirect('/');
});
//use heroku port automatically using process.env.HOST//
//run simultaneously both on heroku and localhosht//
app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port:3000");
})

// mailchimp api key
// 8c3eddb2712175d65a24c9a91c65ad98-us14

// mailchimp audience id
// 75e2342e6d
