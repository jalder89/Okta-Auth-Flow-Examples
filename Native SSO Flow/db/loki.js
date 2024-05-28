const loki = require("lokijs");
let db = new loki("auth.db");

let sessions = db.addCollection("tokenBundle", { indices: ["uid"] });
function addSession(tokenBundle) {
    const identity = JSON.parse(
      Buffer.from(tokenBundle.id_token.split(".")[1], "base64").toString()
    );
    const expirationDate = new Date(identity.exp * 1000);
    const issueDate = new Date(identity.iat * 1000);
    const session = sessions.insert({ sub: identity.sub, username: identity.preferred_username, tokenBundle: tokenBundle, issued: issueDate, expiration: expirationDate });
    return session;
}

function getSession() {

}

module.exports = {
    addSession,
    getSession,
}