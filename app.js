const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Array to store todo tasks or items
// I can make array to const because it allowed in JavaScript to change outside of any const object but not the insides.
// Such like I can push elements in array but I can't assign anything new to this array.
// For more explaination search on const MDN web docs.

// const items = [];
// const workItems = [];

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = new mongoose.model("item", itemsSchema);
const List = new mongoose.model("List", listSchema);

const first = new Item({
  name: "The first Task",
});

const second = new Item({
  name: "The second Task",
});

const third = new Item({
  name: "The third Task",
});

const defaultItems = [first, second, third];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    // To insert for first time
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added!");
        }
      });
    }

    if (err) {
      console.log(err);
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:listName", function (req, res) {
  const listName = _.capitalize(req.params.listName);

  List.findOne({ name: listName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.listItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  // console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteOne({ _id: checkedItemId }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Item Deleted");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
