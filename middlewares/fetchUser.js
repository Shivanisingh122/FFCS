const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'Abc!1234%$#@'; // Use environment variables

const verify = (roles = []) => {
    return (req, res, next) => {
        try {
            // Check if cookies are available
            if (!req.cookies || !req.cookies.token) {
                return res.status(401).json({ message: 'No token provided.' });
            }

            // Extract the token from cookies
            const token = req.cookies.token;

            // Verify the token
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    console.error('Token verification error:', err);
                    return res.status(403).json({ message: 'Invalid token.' });
                }

                // Set user data from token
                req.user = decoded;

                
                

                // Check if the user's role matches the allowed roles
                if (roles.length && !roles.includes(decoded.type)) {
                    return res.status(403).json({ message: 'Access denied.' });
                }

                // Proceed to the next middleware or route handler
                next();
            });
        } catch (error) {
            console.error('Middleware error:', error);
            return res.status(500).json({ message: 'Authentication failed.' });
        }
    };
};

module.exports = { verify };
