import Container from "typedi";
import { TokenService } from "../src/services/TokenService";
import FakeTokenService from "./services/FakeTokenService";
import server from "../src/server";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { it, describe, before } from "mocha";
import { createConnection } from "typeorm";

chai.use(chaiHttp);
Container.set(TokenService, new FakeTokenService());

before(() => {
    return createConnection();
});

describe("User", () => {
  it("normal user can not get /users", async () => {
    const response = await chai
      .request(server)
      .get("/users")
      .send();
    expect(response).to.have.status(403);
  });
});
