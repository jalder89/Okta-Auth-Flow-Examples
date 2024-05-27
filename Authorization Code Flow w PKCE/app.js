require("dotenv").config();
const path = require("path");
const axios = require("axios");
const express = require("express");
const app = express();
const pkceUtil = require("./pkce.js")

let pkceObject = {};

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname), "public", "index.html");
});

app.get("/auth-code-flow-pkce", async (req, res) => {
  pkceObject = await pkceUtil.generateAuthURI();
  res.redirect(pkceObject.authURI);
})

// Authorization Code Flow w PKCE - Sets auth server via state value
app.get("/login/callback", async (req, res) => {
  res.send("Auth Code Received");
  const response = await axios({
    method: "post",
    url: `https://${process.env.OKTA_ORG_URI}/oauth2/${req.query.state}/v1/token`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    params: {
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      redirect_uri: "http://localhost:8080/login/callback",
      code: req.query.code,
      code_verifier: pkceObject.verifier,
    },
  })
    .then(async (response) => {
      return response;
    })
    .catch((error) => {
      console.log(
        `Error: ${error.response.data.error} \nDescription: ${error.response.data.error_description}`
      );
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
