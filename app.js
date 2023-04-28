const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());

const people = [];

//app.all("/api/v1/*", (req, res) => {
//  res.json({ error: "That route is not implemented." });
//});

//adding an entry
app.post("/api/v1/people", (req, res) => {
  const { name, age } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Please provide name" });
  } else if (!age) {
    return res.status(400).json({ message: "Please provide age" });
  } else if (Number(age) < 0) {
    return res
      .status(400)
      .json({ msg: "Please provide a correct age (non-negative number)" });
  }

  req.body.index = people.length;
  people.push(req.body);
  console.log(people);
  res
    .status(201)
    .json({ msg: "A person record was added", id: req.body.index });
});

app.get("/api/v1/people", (req, res) => {
  return res.status(200).json({ people });
});

app.get("/api/v1/people/:id", (req, res) => {
  const { id } = req.params;
  if (Number(id) < 0 || Number(id) >= people.length) {
    return res
      .status(404)
      .json({ msg: "The person with this id does not exist" });
  }
  return res.status(200).json(people[id]);
});

const server = app.listen(3000, () => {
  console.log("listening on port 3000...");
});

module.exports = { app, server };
