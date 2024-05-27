require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

// Authorization Code Flow - Sets auth server via state value
app.get("/authorization-code/callback", async (req, res) => {
  res.send("Auth Code Received");
  const response = await axios({
    method: "post",
    url: `https://${process.env.OKTA_ORG_URI}/oauth2/${req.query.state}/v1/token`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    params: {
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:8080/authorization-code/callback",
      code: req.query.code,
    },
  })
  .then(async (response) => {
    return response;
  })
  .catch((error) => {
    console.log(`Error: ${error.response.data.error} \nDescription: ${error.response.data.error_description}`);
    return error.response.data;
  });
  
  if (response.data) {
    const identity_token = JSON.parse(
      Buffer.from(response.data.id_token.split(".")[1], "base64").toString()
    );
    console.log(response.data.refresh_token)
  }
});

app.listen(Number(process.env.PORT || 3000));
console.log(`App listening on ${process.env.PORT || 3000}`);
