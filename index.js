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
  const result = await db.query(
    "SELECT * FROM complaint c JOIN complaint_status cs ON c.status_id = cs.status_id LEFT JOIN admin_remark ar ON c.complaint_id = ar.complaint_id WHERE user_id=$1 ORDER BY created_at DESC",
    [currentUserId],
  );
  return result;
}

app.get("/", async (req, res) => {
  res.render("user/home.ejs");
});

app.get("/register", async (req, res) => {
  res.render("user/register.ejs");
});

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const department = req.body.department;
  const year = req.body.year;

  try {
    const check = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (check.rows.length > 0) {
      // res.send("Email already registered. Try Login");
      res.render("user/home.ejs", {
        msg: "Email already registered. Try Login",
      });
    } else {
      const result = await db.query(
        "INSERT INTO users(name,email,password,department,year) VALUES($1,$2,$3,$4,$5)",
        [name, email, password, department, year],
      );
      console.log(result);
      res.render("user/home.ejs", {
        msg: "Registered Successfully. Go for Login",
      });
    }
  } catch (err) {
    console.log("ERROR IN Registeration", err);
  }
});

app.get("/login", async (req, res) => {
  res.render("user/login.ejs");
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  const check = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  if (check.rows.length == 0) {
    // res.send("Email not registered. Try registeration first");
    res.render("user/home.ejs", {
      msg: "Email not registered. Try registration first",
    });
  } else {
    if (check.rows[0].password != password) {
      // res.send("Password is Incorrect");
      res.render("user/home.ejs", {
        msg: "Input password is incorrect",
      });
    } else {
      currentUserId = check.rows[0].user_id;

      const result = await getItems();

      await db.query(
        "INSERT INTO login_history(login_time,user_id) VALUES($1,$2)",
        [new Date(), currentUserId],
      );

      console.log(currentUserId);
      res.render("user/index.ejs", { listItems: result.rows });
    }
  }
});

app.get("/new", async (req, res) => {
  const cat = await db.query("SELECT * FROM category");
  console.log(cat.rows);
  res.render("user/modify.ejs", {
    heading: "New Complaint",
    categories: cat.rows,
  });
});

app.post("/new", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.cat;

  console.log(title + description + category);

  db.query(
    "INSERT INTO complaint(title,description,created_at,user_id,category_id) VALUES ($1,$2,$3,$4,$5)",
    [title, description, new Date(), currentUserId, category],
  );

  // db.query("INSERT INTO compla")

  const result = await getItems();
  console.log("new = ", result.rows);
  res.render("user/index.ejs", { listItems: result.rows });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
