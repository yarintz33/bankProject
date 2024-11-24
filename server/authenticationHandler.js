import jwt from "jsonwebtoken";

function authFunc(req, res, next) {
  console.log("in authFunc");
  auth("access-token", process.env.SECRET_KEY_USERS, req, res, next);
}

function registrationAuth(req, res, next) {
  auth("registration_token", process.env.SECRET_KEY_AUTH, req, res, next);
}

function refreshAuth(req, res, next) {
  auth("refresh-auth_token", process.env.REFRESH_TOKEN, req, res, next);
}

function auth(tokenName, tokenKey, req, res, next) {
  const token = req.cookies?.[tokenName];
  if (!token) {
    console.log("no access token..");
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, tokenKey); // Verify token
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token." });
  }
}

export { authFunc, registrationAuth, refreshAuth };
