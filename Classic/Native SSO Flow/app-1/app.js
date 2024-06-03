// Use Authorization Code with PKCE to obtain the authorization code for client 1. DONE
// Exchange the code for tokens. DONE
// Exchange existing tokens that are obtained from client 1 for a new set of tokens for client 2.
// Validate the device secret.
// Revoke the device secret to end the session.
require("dotenv").config()
const axios = require("axios");
const express = require("express");
const opener = require("opener")
const pkceUtil = require("./pkce.js");
const auth = require("../api/authorization.js");
const sessions = require("../db/loki.js");

const app = express();
let pkceObject = {};

// Auth code callback, exchanges code for token bundle.
app.get("/login/callback", async (req, res) => {
    res.send("Redirect Received");
    const tokenBundle = await auth.getTokens(req, pkceObject);
    const session = sessions.addSession(tokenBundle);
    await axios({
      method: "post",
      url: `http://localhost:8082/app-1/sso/callback`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      data: {
        session: session,
      }
    });

});

// Main entry point for app, starts Auth Code w PKCE flow.
async function main() {
    pkceObject = await pkceUtil.generateAuthURI();
    opener(pkceObject.authURI)
}

// App listener converts to Number before binding to PORT or 3000. Number() avoids binding issues with Heroku.
app.listen(Number(process.env.PORT || 3000));
console.log(`App listening on ${process.env.PORT || 3000}`);
main();