import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import fetch from "node-fetch";
// import dotenv from "dotenv";
// dotenv.config();

let pems = null;

export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    // Download JWKS (public keys) from Cognito the first time
    if (!pems) {
      const url = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
      const response = await fetch(url);
      const { keys } = await response.json();
      pems = {};
      keys.forEach((key) => {
        pems[key.kid] = jwkToPem(key);
      });
    }

    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const pem = pems[decoded.header.kid];
    if (!pem) {
      return res.status(401).json({ error: "Invalid token signature" });
    }

    jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, payload) => {
      if (err) return res.status(401).json({ error: "Token verification failed" });
      req.user = payload;
      next();
    });
  } catch (err) {
    console.error("Auth verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
