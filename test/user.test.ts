import server from "../src/server";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { it, describe, before } from "mocha";
import { createConnection } from "typeorm";

chai.use(chaiHttp);

before(async () => {
    return createConnection();
});

const app = server.listen(3000);

describe("User", () => {
  it("normal user can not get /users", async () => {
    const response = await chai
      .request(app)
      .get("/users")
      .send();
    expect(response).to.have.status(403);
  });
  it("create user", async () => {
    const response = await chai
      .request(app)
      .post("/users")
      .send({
        email: "felihenrique@gmail.com",
        password: "123456",
        profile: {
          name: "felipe"
        }
      });
    expect(response).to.have.status(200);
  });
  it("normal user can not get /users/id/foods", async () => {
    const response = await chai
      .request(app)
      .get("/users/1/foods")
      .send();
    expect(response).to.have.status(403);
  });
});
