import jwt from "jsonwebtoken";

const refreshToken = async (req, res, next) => {
  if (req.cookies?.["refresh-auth_token"]) {
    const refreshToken = req.cookies?.["refresh-auth_token"];

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(406).json({ message: "Unauthorized" });
      } else {
        const accessToken = jwt.sign(
          {
            userId: decoded.userId,
            email: decoded.email,
          },
          process.env.SECRET_KEY_USERS,
          {
            expiresIn: "10m",
          }
        );

        res.cookie("access-token", accessToken, {
          httpOnly: true,
          sameSite: "Strict", //"None"?q
          secure: true,
          //path: "/",
          maxAge: 60 * 60 * 5 * 1000, // 5 hours
        });
        return res.json("accessToken sent in cookie");
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
};

export default refreshToken;
