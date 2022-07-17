import jwt from "jsonwebtoken";

export function login(req, res, next) {
  try {
    const decode = jwt.verify(
      req.body.token,
      "keyquedeveserfeitaemvariaveldeambientelalala"
    );
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Authentication fail." });
  }
}
