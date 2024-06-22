const request = require("supertest");
const app = require("../app"); // Make sure this path correctly points to your Express app

describe("Chat API", () => {
  it("POST /api/chats should create a new chat", async () => {
    const newChat = {
      no: "1",
      penugasan_id: 1,
      tim_id: 1,
      penerima: "receiver@example.com",
      pengirim: "sender@example.com",
      judul: "Important",
      isi: "Hello, this is a test message.",
    };

    const response = await request(app)
      .post("/api/chats")
      .send(newChat)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("pengirim", newChat.pengirim);
  });

  it("GET /api/chats/:pengirim should retrieve a chat by pengirim", async () => {
    const pengirim = "sender@example.com";
    const response = await request(app)
      .get(`/api/chats/${pengirim}`)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("pengirim", pengirim);
  });

  // Optionally add more tests to handle other scenarios, like not finding a chat
  it("GET /api/chats/:pengirim should return 404 if chat not found", async () => {
    const pengirim = "non_existent_sender@example.com";
    const response = await request(app)
      .get(`/api/chats/${pengirim}`)
      .expect(404);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Chat not found");
  });
});
