// Middleware function to determine if the API endpoint request is from an authenticated user
// One could say this file is the bouncer that checks guests and customers ID(token) before they are allowed into a club (or an API destination)

const jwt = require('jsonwebtoken');

function isAuth(req, res, next)
{
	const header = req.headers.authorization;
	// Header needs to be included
	if(!header)
	{
		return res.status(401).json({ message: "No token provided" });
	}

	// Splitting the header from the token to separate the two. Otherwize the header would be read as part of the token which would be incorrect token
	const token = header.split(' ')[1];

	try
	{
		// Checks if the token is valid
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = decoded;
		next();
	}
	catch(err)
	{
		return res.status(401).json({ message: "Invalid token" });
	}
}

module.exports = isAuth;

