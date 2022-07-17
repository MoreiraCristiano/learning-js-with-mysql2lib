import jwt from "jsonwebtoken";

export const login = {
  required: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.MYSQL_JWT_PRIVATE_KEY);
      req.user = decode;
      next();
    } catch (error) {
      return res.status(401).send({ message: "Authentication fail." });
    }
  },

  // Can be optional, but i dont know where I can use
  optional: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.MYSQL_JWT_PRIVATE_KEY);
      req.user = decode;
      next();
    } catch (error) {
      next();
    }
  },
};
