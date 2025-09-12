import { auth } from "express-oauth2-jwt-bearer";
import { config } from "./config";
import { ApiResponseFactory } from "../utils/api-response";

export const checkJwt = auth({
    audience: config.AUTH0_AUDIENCE,
    issuerBaseURL: config.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

export const extractUserInfo = (req: any, res: any, next: any) => {
  try {
    const auth = req.auth;
    req.user = {
      id: auth.payload.sub,
      email: auth.payload.email
    };
    next();
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    res.status(401).json(ApiResponseFactory.error('Unauthorized', 401, errorMessage));
  }
};