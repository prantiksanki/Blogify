const jwt = require("jsonwebtoken") ; 
const secret = "Sanki@2004" ; 

function createTokenForUser(user)
{
    const payload = 
    {
        _id : user._id , 
        email : user.email , 
        profileImageURL : user.profileImageURL , 
        role : user.role , 
    } ;

    const token = jwt.sign(payload , secret) ; 

    return token ; 
}


function validateToken(token) {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (err) {
        console.error("Token validation failed:", err.message);
        throw new Error("Invalid or expired token");
    }
}

module.exports = {
    createTokenForUser, 
    validateToken,
}; 
