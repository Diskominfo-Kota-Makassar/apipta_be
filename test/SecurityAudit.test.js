const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../middleware/auth");

describe("Security Audit Verification (F01 - F04)", () => {
  // Generate sample tokens for testing
  const adminToken = generateToken({
    id: 1,
    username: "admin_test",
    role_id: 1,
    entitas: "Inspektorat",
  });

  const userAToken = generateToken({
    id: 10,
    username: "user_a",
    role_id: 2,
    entitas: "OPD A",
  });

  const userBToken = generateToken({
    id: 20,
    username: "user_b",
    role_id: 2,
    entitas: "OPD B",
  });

  // F01 T01: GET data terlindungi tanpa sesi atau token harus ditolak 401
  it("F01 T01: GET /api/user/all without token should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/user/all");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.data).toBeUndefined();
  });

  // F01 T02: Token invalid atau rusak harus ditolak 401
  it("F01 T02: GET /api/user/all with invalid token should return 401 Unauthorized", async () => {
    const res = await request(app)
      .get("/api/user/all")
      .set("Authorization", "Bearer invalid.token.payload");
    expect(res.status).toBe(401);
  });

  // F01 T03: Pengguna biasa (non-admin) memanggil endpoint administratif harus ditolak 403
  it("F01 T03: GET /api/user/all with non-admin token should return 403 Forbidden", async () => {
    const res = await request(app)
      .get("/api/user/all")
      .set("Authorization", `Bearer ${userAToken}`);
    expect(res.status).toBe(403);
    expect(res.body.data).toBeUndefined();
  });

  // F01 T04: Pengguna A tidak boleh mengubah akun pengguna B (403)
  it("F01 T04: User A attempting to modify User B account should return 403 Forbidden", async () => {
    const res = await request(app)
      .put("/api/user/20")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ nama: "Hacked by User A" });
    expect(res.status).toBe(403);
  });

  // F01 T05: Pengguna biasa tidak boleh menaikkan privilege / mengubah role_id
  it("F01 T05: Regular user attempting to update role_id should be rejected 403", async () => {
    const res = await request(app)
      .put("/api/user/10")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ role_id: 1 });
    expect(res.status).toBe(403);
  });

  // Public endpoints: roles dan penugasan harus bisa diakses publik untuk dropdown frontend
  it("GET /api/roles should be publicly accessible without token", async () => {
    const res = await request(app).get("/api/roles");
    expect(res.status).not.toBe(401);
  });

  it("GET /api/penugasan should be publicly accessible without token", async () => {
    const res = await request(app).get("/api/penugasan");
    expect(res.status).not.toBe(401);
  });

  // Namun GET /api/roles/user yang berisi data user tetap wajib terlindungi (401)
  it("GET /api/roles/user should remain protected (401 without token)", async () => {
    const res = await request(app).get("/api/roles/user");
    expect(res.status).toBe(401);
  });

  // F04: Endpoint file tanpa token harus ditolak 401
  it("F04: GET /api/file/:objectName without token should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/file/document.pdf");
    expect(res.status).toBe(401);
  });

  // F04: Path traversal pada file endpoint harus ditolak 400
  it("F04: Path traversal on file endpoint should be rejected 400", async () => {
    const res = await request(app)
      .get("/api/file/..%2F..%2Fetc%2Fpasswd")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });

  // F03: Upload dengan ekstensi berbahaya (.exe, .php, dll) harus ditolak 400
  it("F03: Upload of dangerous executable should be rejected 400", async () => {
    const res = await request(app)
      .post("/api/permintaan")
      .set("Authorization", `Bearer ${userAToken}`)
      .attach("file", Buffer.from("malicious code"), "exploit.php");
    expect(res.status).toBe(400);
  });
});
