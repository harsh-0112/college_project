import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

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

app.get("/admin", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM complaint JOIN category ON complaint.category_id = category.category_id JOIN complaint_status ON complaint.status_id = complaint_status.status_id ORDER BY created_at DESC",
  );
  console.log(result.rows);
  res.render("admin/index.ejs", { listItems: result.rows });
});

app.get("/remark/:id", async (req, res) => {
  const complaint_id = req.params.id;
  const result = await db.query(
    "SELECT * FROM complaint WHERE complaint_id = $1",
    [complaint_id],
  );
  const status = await db.query("SELECT * FROM complaint_status");
  const compl_status = await db.query(
    "SELECT * FROM complaint_status WHERE status_id = $1",
    [result.rows[0].status_id],
  );

  console.log(compl_status.rows);

  if (compl_status.rows.length != 0) {
    res.render("admin/modify.ejs", {
      complaint: result.rows[0],
      status: status.rows,
      compl_status: compl_status.rows,
    });
  } else {
    res.render("admin/modify.ejs", {
      complaint: result.rows[0],
      status: status.rows,
    });
  }
});

app.post("/remark/:id", async (req, res) => {
  const complaint_id = req.params.id;
  const compl_status_id = req.body.status;
  const remark_text = req.body.remark;

  console.log(complaint_id + " hehe " + compl_status_id);
  await db.query("UPDATE complaint SET status_id=$1 WHERE complaint_id=$2", [
    compl_status_id,
    complaint_id,
  ]);

  await db.query(
    "UPDATE admin_remark(remark_text,remark_date,complaint_id) VALUES($1,$2,$3)",
    [remark_text, new Date(), complaint_id],
  );
  res.redirect("/admin");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
