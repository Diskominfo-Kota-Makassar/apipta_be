const request = require("supertest");
const app = require("../app"); // Ensure you export your Express app

describe("Penugasan API", () => {
  it("POST /api/penugasan", async () => {
    const data = {
      no: "003",
      tgl: new Date(),
      uraian: "Audit on IT infrastructure",
      tgl_mulai: new Date(),
      tgl_berakhir: new Date(),
      pj_id: 1,
      wpj_id: 2,
      dalnis_id: 3,
      tim_id: [4, 3],
      kt_id: 5,
    };

    const response = await request(app)
      .post("/api/penugasan")
      .send(data)
      .expect(201);

    expect(response.status).toBe(201);
  });

  // it("GET /api/penugasan should retrieve a Penugasan", async () => {
  //   const response = await request(app).get("/api/penugasan").expect(200);

  //   expect(response.status).toBe(200);
  // });

  // it("GET /api/penugasan/:id should retrieve a Penugasan", async () => {
  //   const response = await request(app).get("/api/penugasan/002").expect(200);

  //   expect(response.status).toBe(200);
  // });

  // it("PUT /api/penugasan/:id should update a Penugasan", async () => {
  //   const updatedData = {
  //     uraian: "Updated Audit on IT infrastructure",
  //     tgl_berakhir: new Date(
  //       new Date().setFullYear(new Date().getFullYear() + 1)
  //     ),
  //   };

  //   const response = await request(app)
  //     .put("/api/penugasan/002")
  //     .send(updatedData)
  //     .expect(200);

  //   expect(response.status).toBe(200);
  // });

  // it("DELETE /api/penugasan/:id should delete a Penugasan", async () => {
  //   const response = await request(app)
  //     .delete("/api/penugasan/002")
  //     .expect(200);

  //   expect(response.status).toBe(200);
  // });
});
