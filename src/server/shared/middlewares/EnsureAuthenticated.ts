import { RequestHandler } from "express";
import { JWTService } from "../services";
import { UnauthorizedError } from "../../helpers/Errors/UnauthorizedError";



export const ensureAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  console.log(req.headers);

  if (!authorization) throw new UnauthorizedError()

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer') throw new UnauthorizedError()

  const jwtData = JWTService.verify(token);

  console.log(jwtData)
  
  if (jwtData === 'JWT_SECRET_NOT_FOUND') throw new UnauthorizedError()
  if (jwtData === 'INVALID_TOKEN') throw new UnauthorizedError()

  console.log(jwtData);

  req.headers.idUsuario = jwtData.uid.toString();

  return next();
}