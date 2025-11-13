import { verifyJWT } from "./auth.middleware.js";
import { verifyApiKey } from "./apiKey.middleware.js";

export const verifyAuth = async (req, res, next) => {
    // Check for API key first
    const apiKey = req.header("X-API-Key");
    if (apiKey) {
        return verifyApiKey(req, res, next);
    }

    // Otherwise, use JWT
    return verifyJWT(req, res, next);
};