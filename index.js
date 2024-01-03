import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const db = new pg.Client({
  user: "postgres",
  host: "localhost" || "dpg-cmar516n7f5s7396c0sg-a",
  database: "Books" || "books_0o21",
  password: "1234" || "OUQiIxMpajgPtpSzqJ0DjWOiaUxthICX",
  port: 5432,
  url: "postgres://books_0o21_user:OUQiIxMpajgPtpSzqJ0DjWOiaUxthICX@dpg-cmar516n7f5s7396c0sg-a.oregon-postgres.render.com/books_0o21"
});

db.connect();

const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  
  var books = [];

  const result = await db.query("select * from books");
  result.rows.forEach(async (item) => {
    books.push(item);
  });
  //console.log(books);
  res.render("index.ejs", { books: books });
});

app.get("/admin", async (req, res) => {
  res.render("admin.ejs");
});

app.get("/add-books", async (req, res) => {
  res.render("add-books.ejs");
});

app.get("/add-admin", async (req, res) => {
  res.render("add-admin.ejs");
});

app.get("/all-books", async (req, res) => {
  var books = [];
  const result = await db.query("select * from books");
  result.rows.forEach((item) => {
    books.push(item);
  });
  //console.log(books);
  res.render("all-books.ejs", { book: books });
});

app.get("/all-admins", async (req, res) => {
  var admins = [];
  const result = await db.query("select * from admin");
  result.rows.forEach((item) => {
    admins.push(item);
  });
  //console.log(books);
  res.render("all-admins.ejs", { admin: admins });
});

app.post("/login", async (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];
  console.log(username);
  console.log(password);
  const r = await db.query("select count(*) from admin where username = $1", [
    username,
  ]);
  //console.log(r.rows[0].count);
  if (r.rows[0].count == 1) {
    const result = await db.query(
      "select password from admin where username = $1",
      [username]
    );
    if (result.rows[0].password == password) {
      res.render("admin-panel.ejs");
    } else {
      res.render("admin.ejs", {
        err: "Username or Password Incorrect",
      });
    }
  } else {
    res.render("admin.ejs", {
      err: "Username or Password Incorrect",
    });
  }
});

app.post("/book-review", async (req, res) => {
  const ISBN =
    "https://covers.openlibrary.org/b/isbn/" + req.body["ISBN"] + "-L.jpg";
  const bookName = req.body["bookName"];
  const authorName = req.body["authorName"];
  const readDate = req.body["readDate"];
  const rating = req.body["rating"];
  const bookreview = req.body["bookreview"];
  db.query(
    "insert into books (isbn , bookname, authorname, readdate, rating , bookreview) values ($1 , $2 , $3 , $4 , $5 , $6)",
    [ISBN, bookName, authorName, readDate, rating, bookreview]
  );
  res.redirect("/all-books");
});

app.post("/add-admins", async (req, res) => {
  const name = req.body["name"];
  const username = req.body["username"];
  const password = req.body["password"];
  db.query(
    "insert into admin (name , username , password) values ($1 , $2 , $3)",
    [name, username, password]
  );
  res.redirect("/all-admins");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
