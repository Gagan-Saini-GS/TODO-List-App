const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Array to store todo tasks or items
// I can make array to const because it allowed in JavaScript to change outside of any const object but not the insides.
// Such like I can push elements in array but I can't assign anything new to this array.
// For more explaination search on const MDN web docs.

const items = [];
const workItems = [];

app.get("/", function (req, res) {
  const day = date.getDate();
  res.render("list", { listTitle: day, newListItems: items });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/", function (req, res) {
  const item = req.body.listItem;
  const list = req.body.list;

  if (list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
