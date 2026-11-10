// The class that gathers all logic for the user operations
class UserService
{
    constructor(db)
    {
        this.User = db.User;
    }

    // CRUD-READ. Get's a user by the email-parameter. This is necessary to check if a user already exists in the database with said email-address
    // This happens inside the router.post('/signup', async (req, res, next) => If we try to sign up a users with two identical email-address, the request fails
    async getOne(email)
    {
        return this.User.findOne
        ({
            where: { email: email }
        });
    }

    // CRUD-CREATE. Used for primarily user-signup, but also login. Both are post requests. During login the email and password parameters are collected in a Post-request
    async create(name, email, encryptedPassword, salt)
    {
        return this.User.create
        ({
            name: name,
            email: email,
            encryptedPassword: encryptedPassword,
            salt: salt
        });
    }
}

module.exports = UserService;