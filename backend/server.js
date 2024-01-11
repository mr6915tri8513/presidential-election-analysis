import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bodyParser from "body-parser"
import mysql from "mysql2"
import dotenv from "dotenv"

const app = express()

dotenv.config()

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise()

app.use(cors())
app.use(bodyParser.json())

app.get("/api/", (req, res) => {
  res.send("Hello World!")
})

app.get("/api/users", (req, res) => {
  // pool.query("SELECT * FROM users", (err, result) => {
  //   if (err) throw err
  //   res.send(result)
  // })
  console.log('user')
  res.send("{id: 1, name: 'John Doe'}")
})

app.listen(3000, () => console.log("Server running on port 3000"))
