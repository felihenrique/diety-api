import Container from "typedi";
import { TokenService } from "../src/services/TokenService";
import FakeTokenService from "./services/FakeTokenService";
import server from "../src/server";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { it, describe, before } from "mocha";

chai.use(chaiHttp);
Container.set(TokenService, new FakeTokenService());
let app = null;

before(async () => {
    app = await server;
    return;
});

describe("Main", () => {
  it("should not get /", async () => {
    const response = await chai
      .request(app)
      .get("/")
      .send();
    expect(response).to.not.have.status(200);
  });
});
