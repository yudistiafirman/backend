const crypto = require("crypto");

function hashing(pass) {
  const hmac = crypto.createHmac("sha256", "abc123");
  const afterHash = hmac.update(pass).digest("hex");
  return afterHash;
}

module.exports = hashing;
