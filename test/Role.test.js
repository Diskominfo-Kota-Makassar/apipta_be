const request = require("supertest");
const app = require("../app"); // Ensure this path correctly points to your Express app

describe("Role API", () => {
  it("GET /roles/user should retrieve all roles", async () => {
    const response = await request(app).get("/api/roles/user").expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Role successful!");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("POST /roles should create a new role", async () => {
    const newRole = {
      name: "Administrator2",
    };

    const response = await request(app)
      .post("/api/roles")
      .send(newRole)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Role.");
    expect(response.body).toHaveProperty("userId");
  });

  it("GET /roles should retrieve all roles", async () => {
    const response = await request(app).get("/api/roles").expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Role successful!");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("PUT /roles/:id should update a role", async () => {
    const updatedRole = {
      name: "Super User",
    };
    const roleId = 1; // Assuming this ID exists in your test database

    const response = await request(app)
      .put(`/api/roles/${roleId}`)
      .send(updatedRole)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Role updated successfully!"
    );
    expect(response.body.data).toHaveProperty("name", updatedRole.name);
  });

  // it("DELETE /roles/:id should delete a role", async () => {
  //   const roleId = 1; // Assuming this ID exists and can be deleted in your test environment

  //   const response = await request(app)
  //     .delete(`/api/roles/${roleId}`)
  //     .expect(200);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "Role deleted successfully!"
  //   );
  // });
});
