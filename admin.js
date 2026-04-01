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
    "SELECT * FROM complaint c JOIN complaint_status cs ON c.status_id = cs.status_id ORDER BY created_at DESC",
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
  console.log(result.rows[0]);
  const status = await db.query("SELECT * FROM complaint_status");

  console.log(status.rows);

  res.render("admin/modify.ejs", {
    heading: "Add Remark",
    complaint: result.rows[0],
    status: status.rows,
  });
});

app.post("/remark/:id", async (req, res) => {
  const complaint_id = req.params.id;
  const compl_status_id = req.body.status;
  const remark_text = req.body.admin_text;

  // console.log(compl_status_id);
  await db.query("UPDATE complaint SET status_id=$1 WHERE complaint_id=$2", [
    compl_status_id,
    complaint_id,
  ]);

  try {
    await db.query(
      "INSERT INTO admin_remark (remark_text, remark_date,complaint_id) VALUES ($1, $2, $3) ON CONFLICT (complaint_id) DO UPDATE SET remark_text = EXCLUDED.remark_text, remark_date = CURRENT_TIMESTAMP;",
      [remark_text, new Date(), complaint_id],
    );
    res.redirect("/admin");
  } catch (err) {
    console.log("Error while Inserting admin_remark" + err);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
