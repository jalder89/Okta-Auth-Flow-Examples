// Creates PKCE verifier string of length size
function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

// Generates challenge by URL encoding the SHA-256 hashed verifier
function base64URLEncode(str) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Hashes the verifier before encoding
function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

// Generates and returns the challenge by hashing and URL encoding the verifier
async function generateCodeChallenge(verifier) {
  const hashed = await sha256(verifier);
  return base64URLEncode(hashed);
}

// Adjust Auth Server here - Update state param of authURI with Auth Server ID as well, this is how app.js sets the auth server
async function generateAuthURI() {
  const verifier = generateRandomString(50);
  const challenge = await generateCodeChallenge(verifier);
  const authURI = `https://${process.env.OKTA_ORG_URI}/oauth2/${process.env.OKTA_DEFAULT_AUTH_SERVER}/v1/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=openid device_sso offline_access&redirect_uri=http://localhost:8080/login/callback&state=default&code_challenge_method=S256&code_challenge=${challenge}`;
  const pkceUtil = {
    authURI: authURI,
    verifier: verifier,
    challenge: challenge
  }
  return pkceUtil
}

module.exports = {
    generateAuthURI
}
