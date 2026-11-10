var express = require('express');
var router = express.Router();
var jsend = require('jsend');
router.use(jsend.middleware);
const UserService = require('../services/UserService');
const db = require('../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userService = new UserService(db);

// Post for registered users to be able to login
router.post('/login', async (req, res, next) =>
{

    // #swagger.tags = ['Users']
    // #swagger.description = "User-login and receive a token for the specific user"
    /* #swagger.parameters['body'] =
    {
    in: 'body',
    description: 'User login credentials',
    required: true,
        schema:
        {
            email: "jason@test.com",
            password: "Jason1"
        }
    }
*/

	// Extracting email and password from the request body
	const { email, password } = req.body;

	// If any of those fields are missing (null or undefined), an error-message occours relevant to the specifik field
    if (email == null)
    {
        return res.jsend.fail({"email": "Email is required."});
    }
    if (password == null)
    {
        return res.jsend.fail({"password": "Password is required."});
    }

	const user = await userService.getOne(email);

	if(user == null)
	{
		return res.jsend.fail({ "result": "Incorrect email or password" });
	}
	
	crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword)
    {
        if (err) { return next(err); }

        // This line compares the two hashes. The one that is stored in the database and the one that is used in the login
        if (!crypto.timingSafeEqual(user.encryptedPassword, hashedPassword))
        {
            return res.jsend.fail({ "result": "Incorrect email or password" });
        }

        // If the password is correct, a token is given to the user when logged in
        let token;
        try
        {
            token = jwt.sign
			(
                // This is the payload. The client(F.I.Google Chrome) is NOT going to save userId or email. The client saves the token value
                { id: user.id, email: user.email },
                process.env.TOKEN_SECRET,
                { expiresIn: "1h" }
            );
        }
        catch (err)
        {
            return res.jsend.error("JWT error");
        }

        return res.jsend.success
		({
            token: token
        });
    });
	
}); // Done testing!

// Post for new users to register / signup
router.post('/signup', async (req, res, next) =>
{

	// Extracting name, email and password from the request body
	const { name, email, password } = req.body;

	// If the body-fields, name, email or passwords are missing(null or undefined), an error-message is sendt for the relevant field
	if (name == null)
    {
        return res.jsend.fail({"name": "Name is required."});
    }
    if (email == null)
    {
        return res.jsend.fail({"email": "Email is required."});
    }
    if (password == null)
    {
        return res.jsend.fail({"password": "Password is required."});
    }

    // Calling the getOne() method from the UserService-file to check if the email-address is already in use
	var user = await userService.getOne(email);
	if (user != null)
	{
		return res.jsend.fail({ "email": "Provided email is already in use." });
	}

    // Making a random sequence of bytes
	var salt = crypto.randomBytes(16);
	
    // When the a person is signing up a user the password is NOT saved, the hashing is. salt = random value
    // 310000 is the number of iterations. Makes it difficult to brute force. 32 = output-length. 'sha256' = Hash-algorithm
    // Salt is to give a unique value on the different passwords. Reason being if two users coincidentally have the same passwords
	crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function(err, hashedPassword)
	{
		if (err) { return next(err); }

        // The name, email, hashedPassword and uniqe salt-value on that password is stored in the database
		await userService.create(name, email, hashedPassword, salt);
	
		return res.jsend.success({"result": "You created an account."});
	});
}); // Done testing!

router.get('/fail', (req, res) =>
{
	return res.status(401).jsend.error({ statusCode: 401, message: 'message', data: 'data' });
});

module.exports = router; 

