require('dotenv').config();

const request = require("supertest");
const app = require("./app");

// The whole test-block
describe("Todos flow", () =>
{

    // I made a new user in the database to be used as test-user with "name": "Jason", "email": "jason@test.com", "password": "Jason1"
    let email = "jason@test.com"

    // Assigning a variable with the password for the Jason-user
    let password = "Jason1"

    // Assigning a variable to later assign a token value into the variable. Token is essential in many of the upcoming tests
    let token;

    // Assigning a variable to store the created todo's ID for upcoming tests
    let todoId;

    // First test. Login with an authenticated user
    test("POST /users/login - success", async () =>
    {
        // Sending request to the login endpoint. Simulating the http-request without starting the server
        const res = await request(app)
        // Method is post. Endpoint is localhost:3000/users/login
        .post("/users/login")
        // The body is sending email and password
        .send
        ({
            email: email,
            password: password
        });

        // Expected result is correct data of the logged in user and a token assigned to the user
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("token");

        token = res.body.data.token;
    });

    // Second test. Use the token from the first test and get all todo's
    test("GET /todos - success", async () =>
    {
        const res = await request(app)
        // GET method. Endpoint is localhost:3000/todos
        .get("/todos")
        // Using the token from the first test/login
        .set("Authorization", "Bearer " + token);

        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("result");
    });

    // Third test. Use the token and create a new todo
    test("POST /todos - success", async () =>
    {
        const res = await request(app)
        // POST to endpoint: localhost:3000/todos
        .post("/todos")
        // Still using the same token from the first test/login
        .set("Authorization", "Bearer " + token)
        // The data that is going to be posted
        .send
        ({
            name: "Coock dinner",
            description: "Mixing ingredients and fry them",
            // Using an existing CategoryId from the database
            CategoryId: 1,
            // Using an existing StatusId from the database
            StatusId: 1
        });

        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("result");

        // The ID of the todo is saved for next test
        todoId = res.body.data.result.id;
    });

    // Fourth test. Delete the todo from the third test
    test("DELETE /todos/:id - success", async () =>
    {
        const res = await request(app)
        // The todo is deleted by the todoId that was saved from the prior test
        .delete("/todos/" + todoId)
        // Same token as before
        .set("Authorization", "Bearer " + token)

        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("result");
        expect(res.body.data.result).toBe("Todo is deleted");
    });

    // Fifth test. Try to get todo's without token. This test is expected to fail cause of missing token
    test("GET /todos - fail", async () =>
    {
        const res = await request(app)
        // Here, we only include the get method to localhost. But exclude the .set("Authorization", "Bearer " + token)
        .get("/todos")

        // If the test runs correctly, the middlewares-file will deny the get-request
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
    });

    // Finally the sixth test. GET request of all todo's with an invalid token. This test is also supposed to fail
    test("GET /todos - fail",  async () =>
    {
        // Same procedure as before. Sending request to the todos-endpoint
        const res = await request(app)
        .get("/todos")
        // This time, the token is here, but invalid
        .set("Authorization", "Bearer notAvalidToken");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");

    });

});