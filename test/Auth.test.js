const request = require("supertest");
const app = require("../app"); // Ensure you export your Express app

describe("Authentication API", () => {
  it("POST /api/register should register a new user", async () => {
    const newUser = {
      nama: "John Doe",
      username: "john_doe22",
      password: "password123",
      role_id: 1,
    };

    const response = await request(app)
      .post("/api/register")
      .send(newUser)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully."
    );
  });

  it("POST /api/login should authenticate user", async () => {
    const userCredentials = {
      username: "john_doe",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/login")
      .send(userCredentials)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Authentication successful!"
    );
  });
});
