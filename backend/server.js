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

app.get("/api/get_district_in_region", (req, res) => {
  pool.query(`SELECT ${req} FROM Counties`, (err, result) => {
    if (err) throw err
    res.send(result)
  })
  console.log('user')
  res.send("{id: 1, name: 'John Doe'}")
})

app.post("/api/search_poll",(req,res)=>{
  const term = req.body.term;
  const countyId = req.body.countyId;
  const districtId = req.body.districtId;
  const village = req.body.village;

  if (village != 0) {
    pool.query(`select total, president, vicepresident, party from from ( `+
               `SELECT year, team, sum(poll_count) as total FROM Polls `+
               `WHERE station_id = ${village} `+ 
               `GROUP BY team `+
               `) as sub `+
               `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 0 as president `+
               `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 1 as vicepresident `+
               `join Parties.name on president.party_id = Parties.party_id;`
               ,
      (err, result) => {
        if (err) throw err
        res.send(result)
      }
    )
  } else if (districtId != 0) {
    pool.query(`select total, president, vicepresident, party from ( `+
               `SELECT year, team, sum(poll_count) as total FROM Polls `+
               `WHERE station_id in ( `+ 
               `SELECT station_id FROM Poll_stations `+
               `WHERE county_id = ${countyId} `+ 
               `AND district_id = ${districtId}`+
               `) as subsub `+ 
               `GROUP BY team `+
               `) as sub `+
               `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 0 as president `+
               `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 1 as vicepresident `+
               `join Parties.name on president.party_id = Parties.party_id as party;`
               ,
      (err, result) => {
        if (err) throw err
        res.send(result)
      }
    )
    } else if (countyId != 0) {
      pool.query(`select total, president, vicepresident, party from ( `+
      `SELECT year, team, sum(poll_count) as total FROM Polls `+
      `WHERE station_id in ( `+ 
      `SELECT station_id FROM Poll_stations `+
      `WHERE county_id = ${countyId} `+ 
      `) as subsub `+ 
      `GROUP BY team `+
      `) as sub `+
      `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 0 as president `+
      `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 1 as vicepresident `+
      `join Parties.name on president.party_id = Parties.party_id as party;`
      ,
      (err, result) => {
        if (err) throw err
        res.send(result)
      }
    )
  } else {
    pool.query(`select total, president, vicepresident, party from ( `+
    `SELECT year, team, sum(poll_count) as total FROM Polls `+
    `GROUP BY team `+
    `) as sub `+
    `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 0 as president `+
    `join Candidates.name on Candidates.year = sub.year and Candidates.team = sub.team and Candidates.position = 1 as vicepresident `+
    `join Parties.name on president.party_id = Parties.party_id as party;`
    ,
    (err, result) => {
      if (err) throw err
      res.send(result)
    }
    )
  }

})

app.listen(3000, () => console.log("Server running on port 3000"))
