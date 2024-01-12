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
    host: 'localhost',
    user: 'root',
    password: 'sstteeeenn05',
    database: 'final',
  })
  .promise()

app.use(cors())
app.use(bodyParser.json())


function checkEscape(value) {
  if (value === undefined || /['"\\;]/.test(value)) {
    return false
  }
  return true
}

function checkId(id) {
  if (typeof id !== 'string') {
    return false
  }
  if (!id.match(/^[A-Z][12]\d{8}$/)) {
    return false
  }
  
  let sum = id.charCodeAt(0) - 55
  sum = ~~(sum / 10) + sum % 10 * 9;
  for (let i = 1; i < 9; i++) {
    sum += (id.charCodeAt(i) - 48) * (9 - i)
  }
  if (10 - sum % 10 !== id.charCodeAt(9) - 48) {
    return false
  }
  return true
}

app.get("/api/test", async (req, res) => {
  // res.send("Hello World!")
  try {
    const [result, _] = await pool.query('SELECT * FROM Poll_stations LIMIT 10;')
    res.send(result)
  } catch (error) {
    console.log('test error:\n', error)
  }
})

/*
app.get("/api/get_district_in_region", async (req, res) => {
  pool.query(`SELECT ${req} FROM Counties`, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})
*/

app.post("/api/search_poll", async (req, res) => {
  const {term, countyId, districtId, villageId: stationId} = req.body
  if (!checkEscape(term) || !checkEscape(countyId) || !checkEscape(districtId) || !checkEscape(stationId)) {
    res.send([])
    return
  }
  
  if (stationId !== 0) {
    try {
      const [result, _] = await pool.query(
        `SELECT total, candidate1.name AS president, candidate2.name AS vicePresident, Parties.name AS party FROM ( ` +
          `SELECT team, sum(poll_count) AS total FROM Polls ` +
          `WHERE term = ${term} AND station_id = ${stationId} ` + 
          `GROUP BY team ` +
        `) AS sub ` +
        `JOIN Candidates AS candidate1 ON candidate1.term = ${term} AND candidate1.team = sub.team AND candidate1.position = 0 ` +
        `JOIN Candidates AS candidate2 ON candidate2.term = ${term} AND candidate2.team = sub.team AND candidate2.position = 1 ` +
        `JOIN Parties ON candidate1.party_id = Parties.party_id;`
      )
      res.send(result)
    } catch (error) {
      console.log('search village poll error:\n', error)
    }
  } else if (districtId !== 0) {
    try {
      const [result, _] = await pool.query(
        `SELECT total, candidate1.name AS president, candidate2.name AS vicePresident, Parties.name AS party FROM ( ` +
          `SELECT team, sum(poll_count) AS total FROM Polls ` +
          `WHERE term = ${term} AND station_id IN ( ` + 
            `SELECT station_id FROM Poll_stations ` +
            `WHERE county_id = ${countyId} AND district_id = ${districtId} ` +
          `) ` + 
          `GROUP BY team ` +
        `) AS sub ` +
        `JOIN Candidates AS candidate1 ON candidate1.term = ${term} AND candidate1.team = sub.team AND candidate1.position = 0 ` +
        `JOIN Candidates AS candidate2 ON candidate2.term = ${term} AND candidate2.team = sub.team AND candidate2.position = 1 ` +
        `JOIN Parties ON candidate1.party_id = Parties.party_id;`
      )
      res.send(result)
    } catch (error) {
      console.log('search district poll error:\n', error)
    }
  } else if (countyId !== 0) {
    try {
      const [result, _] = await pool.query(
        `SELECT total, candidate1.name AS president, candidate2.name AS vicePresident, Parties.name AS party FROM ( ` +
          `SELECT team, sum(poll_count) AS total FROM Polls ` +
          `WHERE term = ${term} AND station_id IN ( ` + 
            `SELECT station_id FROM Poll_stations ` +
            `WHERE county_id = ${countyId} ` + 
          `) ` + 
          `GROUP BY team ` +
        `) AS sub ` +
        `JOIN Candidates AS candidate1 ON candidate1.term = ${term} AND candidate1.team = sub.team AND candidate1.position = 0 ` +
        `JOIN Candidates AS candidate2 ON candidate2.term = ${term} AND candidate2.team = sub.team AND candidate2.position = 1 ` +
        `JOIN Parties ON candidate1.party_id = Parties.party_id;`
      )
      res.send(result)
    } catch (error) {
      console.log('search county poll error:\n', error)
    }
  } else {
    try {
      const [result, _] = await pool.query(
        `SELECT total, candidate1.name AS president, candidate2.name AS vicePresident, Parties.name AS party FROM ( ` +
          `SELECT team, sum(poll_count) AS total FROM Polls ` +
          `WHERE term = ${term} ` +
          `GROUP BY team` +
        `) AS sub ` +
        `JOIN Candidates AS candidate1 ON candidate1.term = ${term} AND candidate1.team = sub.team AND candidate1.position = 0 ` +
        `JOIN Candidates AS candidate2 ON candidate2.term = ${term} AND candidate2.team = sub.team AND candidate2.position = 1 ` +
        `JOIN Parties ON candidate1.party_id = Parties.party_id;`
      )
      res.send(result)
    } catch (error) {
      console.log('search term poll error:\n', error)
    }
  }
})

app.post("/api/search_district", async (req, res) => {
  const {countyId} = req.body
  if (!checkEscape(countyId)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT id, name FROM ( ` +
        `SELECT DISTINCT district_id AS id FROM Poll_stations ` +
        `WHERE county_id = ${countyId} ` +
      `) AS sub ` +
      `JOIN Districts ON district_id = id;`
    )
    res.send(result)
  } catch (error) {
    console.log('search district error:\n', error)
  }
})

app.post("/api/search_village", async (req, res) => {
  const {countyId, districtId} = req.body
  if (!checkEscape(countyId) || !checkEscape(districtId)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT station_id AS id, village AS name FROM Poll_stations ` +
      `WHERE county_id = ${countyId} AND district_id = ${districtId};`
    )
    res.send(result)
  } catch (error) {
    console.log('search villiage error:\n', error)
  }
})

app.post("/api/login", async (req, res) => {
  const {id, password} = req.body
  if (!checkEscape(id) || !checkEscape(password) || !checkId(id)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT user_id AS id, username AS name, vote_team AS voteTeam, station_id AS stationId FROM Users ` +
      `WHERE user_id = '${id}' AND user_password = '${password}';`
    )
    if (result.length === 0) {
      res.send([])
    } else {
      res.send(result)
    }
  } catch (error) {
    console.log('login error:\n', error)
  }
})

app.post("/api/signup", async (req, res) => {
  const {id, name, password, stationId} = req.body
  if (!checkEscape(id) || !checkEscape(password) || !checkEscape(name) || !checkEscape(stationId) || !checkId(id)) {
    res.send([])
    return
  }
  
  try {
    const [result1, _] = await pool.query(
      `SELECT * FROM Users WHERE user_id = '${id}';`
    )
    if (result1.length !== 0) {
      res.send([])
      return
    }
    
    await pool.query(
      `INSERT INTO Users (user_id, username, user_password, station_id) ` +
      `VALUES ('${id}', '${name}', '${password}', ${stationId});`
    )
    const [result2, __] = await pool.query(
      `SELECT user_id AS id, username AS name, vote_team AS voteTeam, station_id AS stationId FROM Users ` +
      `WHERE user_id = '${id}' AND user_password = '${password}';`
    )
    res.send(result2)
  } catch (error) {
    console.log('signup error:\n', error)
  }
})

app.post("/api/get_station_info", async (req, res) => {
  const {stationId} = req.body
  if (!checkEscape(stationId)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT Counties.name AS county, Districts.name AS district, village FROM Poll_stations ` +
      `JOIN Counties ON Poll_stations.county_id = Counties.county_id ` +
      `JOIN Districts ON Poll_stations.district_id = Districts.district_id ` +
      `WHERE station_id = ${stationId};`
    )
    res.send(result)
  } catch (error) {
    console.log('get station info error:\n', error)
  }
})

app.post("/api/get_team_info", async (req, res) => {
  const {team} = req.body
  if (!checkEscape(team)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT candidate1.name AS president, candidate2.name AS vicePresident, Parties.name AS party FROM Candidates AS candidate1 ` +
      `JOIN Candidates AS candidate2 ON candidate2.term = 16 AND candidate2.team = ${team} AND candidate2.position = 1 ` +
      `JOIN Parties ON candidate1.party_id = Parties.party_id ` +
      `WHERE candidate1.term = 16 AND candidate1.team = ${team} AND candidate1.position = 0;`
    )
    res.send(result)
  } catch (error) {
    console.log('get team info error:\n', error)
  }
})

app.post("/api/update_username", async (req, res) => {
  const {id, name} = req.body
  if (!checkEscape(id) || !checkEscape(name) || !checkId(id)) {
    res.send([])
    return
  }
  
  try {
    await pool.query(
      `UPDATE Users SET username = '${name}' WHERE user_id = '${id}';`
    )

    const [result, _] = await pool.query(
      `SELECT user_id AS id, username AS name, vote_team AS voteTeam, station_id AS stationId FROM Users ` +
      `WHERE user_id = '${id}';`
    )
    res.send(result)
  } catch (error) {
    console.log('update username error:\n', error)
  }
})

app.get("/api/get_vote_teams", async (req, res) => {
  try {
    const [result, _] = await pool.query(
      `SELECT candidate1.team AS team, candidate1.name AS president, candidate2.name AS vicePresident, Parties.name AS party FROM Candidates AS candidate1 ` +
      `JOIN Candidates AS candidate2 ON candidate2.term = 16 AND candidate1.team = candidate2.team AND candidate2.position = 1 ` +
      `JOIN Parties ON candidate1.party_id = Parties.party_id ` +
      `WHERE candidate1.term = 16 AND candidate1.position = 0;`
    )
    res.send(result)
  } catch (error) {
    console.log('get vote teams info error:\n', error)
  }
})

app.post("/api/vote", async (req, res) => {
  const {id, password, team} = req.body
  if (!checkEscape(id) || !checkEscape(password) || !checkEscape(team) || !checkId(id)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT vote_team FROM Users WHERE user_id = '${id}' AND user_password = '${password}'`
    )
    if (!result[0] || result[0].vote_team !== null) {
      res.send([{result: false}])
      return
    }

    await pool.query(
      `UPDATE Users SET vote_team = '${team}' WHERE user_id = '${id}';`
    )
    res.send([{result: true}])
  } catch (error) {
    console.log('vote error:\n', error)
  }
})

app.post("/api/delete_user", async (req, res) => {
  const {id, password} = req.body
  if (!checkEscape(id) || !checkEscape(password) || !checkId(id)) {
    res.send([])
    return
  }
  
  try {
    const [result, _] = await pool.query(
      `SELECT * FROM Users WHERE user_id = '${id}' AND user_password = '${password}'`
    )
    if (!result[0]) {
      res.send([{result: false}])
      return
    }
  
    await pool.query(
      `DELETE FROM Users WHERE user_id = '${id}' AND user_password = '${password}';`
    )
    res.send([{result: true}])
  } catch (error) {
    console.log('delete user error:\n', error)
  }
})

app.listen(3000, () => console.log("Server running on port 3000"))
