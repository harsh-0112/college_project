import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 4000;

const db = new pg.Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/admin", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM complaints_status_view ORDER BY created_at DESC",
  );
  console.log(result.rows);
  const status = await db.query("SELECT * FROM complaint_status");

  res.render("admin/index.ejs", {
    listItems: result.rows,
    status: status.rows,
    current_status: "All",
  });
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

app.post("/filter", async (req, res) => {
  const status_id = req.body.status;
  if (status_id == 0) {
    res.redirect("/admin");
  } else {
    const result = await db.query(
      "SELECT * FROM complaint c JOIN complaint_status cs ON c.status_id = cs.status_id WHERE c.status_id = $1 ORDER BY created_at DESC",
      [status_id],
    );

    const status = await db.query("SELECT * FROM complaint_status");
    const current_status = await db.query(
      "SELECT status_name FROM complaint_status WHERE status_id = $1",
      [status_id],
    );

    res.render("admin/index.ejs", {
      listItems: result.rows,
      status: status.rows,
      current_status: current_status.rows[0].status_name,
    });
    console.log(result.rows);
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/admin`);
});
