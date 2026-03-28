import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  password: "Goli@2005",
  database: "college_project",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

async function getItems() {
  const result = await db.query("SELECT * FROM complaint");
  const data = result.rows;

  const items = [];

  data.forEach((item) => {
    items.push(item);
  });

  return items;
}

app.get("/", async (req, res) => {
  const items = await getItems();
  res.render("index.ejs", {
    listItems: items,
  });
  console.log(items);
});

app.get("/new", async (req, res) => {
  res.render("modify.ejs", { heading: "New Complaint" });
});

app.post("/submit", async (req, res) => {
  const result = req.body;
  const data = result.rows[0];

  db.query(
    "INSERT INTO complaint(title, description, created_at, user_id, category_id, status_id) VALUES($1,$2,$3,$4,$5)",
    [data.title,data.content,new Date(),],
  );
});
// app.post("/add", async (req, res) => {
//   const item = req.body.newItem;
//   await db.query("INSERT INTO items(title) VALUES($1)", [item]);
//   res.redirect("/");
// });

// app.post("/edit", async (req, res) => {
//   const itemID = req.body.updatedItemId;
//   const itemTitle = req.body.updatedItemTitle;
//   console.log(itemID, itemTitle);
//   await db.query("UPDATE items SET title=$1 WHERE id=$2", [itemTitle, itemID]);
//   res.redirect("/");
// });

// app.post("/delete", async (req, res) => {
//   const deleteId = req.body.deleteItemId;
//   const deletedThis = await db.query("DELETE FROM items WHERE id=$1 ", [
//     deleteId,
//   ]);
//   // console.log(deleteId);
//   res.redirect("/");
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
