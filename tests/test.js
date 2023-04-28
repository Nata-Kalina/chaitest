const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

chai.use(chaiHttp);
chai.should();

describe("People", () => {
  after(() => {
    server.close();
  });
  describe("post /api/v1/people", () => {
    it("should not create a people entry without a name", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ age: 10 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ message: "Please provide name" });
        });
      done();
    });
    it("should not create a people entry without an age", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ name: "Anna" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ message: "Please provide age" });
        });
      done();
    });
    it("should create a people entry with valid input", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ name: "Anna", age: 18 })
        .end((err, res) => {
          res.should.have.status(201);

          this.lastIndex = res.body.lastIndex;
          res.body.should.contain({
            msg: "A person record was added",
          });
        });
      done();
    });
  });
  describe("get /api/v1/people", () => {
    it("should return an array of all entries", (done) => {
      chai
        .request(app)
        .get("/api/v1/people")
        .end((err, res) => {
          this.lastIndex = res.body.lastIndex;
          res.should.have.status(200);
          res.body.should.have.length(this.lastIndex + 1);
        });
      done();
    });
  });

  describe("get /apl/v1/people/:id", (req, res) => {
    it("should return the entry corresponding to the last person added", (done) => {
      this.lastIndex = res.body.lastIndex;
      chai
        .request(app)
        .get(`api/v1/people/${this.lastIndex}`)
        .end((err) => {
          res.should.have.status(200);
          console.log(res.body);
          res.body.name.should.be.eql("Anna");
        });
      done();
    });
    it("should return an error if the index is >= the length of the array", (done) => {
      chai
        .request(app)
        .get("/api/v1/people/10")
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });
});
