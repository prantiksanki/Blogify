const {validateToken,createTokenForUser} = require("../services/authentication")

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload; // Attach user payload to the request
        } catch (err) {
            console.error("Error validating token:", err); // Log errors if any
        }

        return next();
    };
}

module.exports = checkForAuthenticationCookie;
