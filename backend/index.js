const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    user: "root",
    password: "password",
    database: "studentperformance" 
});

db.connect(function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("connected to db");
    }
});

app.get('/students', (req, res) => {
  db.query("SELECT matric, forename, surname FROM students", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

app.post('/findstudent', (req, res) => {
  var id = req.body.matric;
  var sql = "SELECT * FROM students WHERE matric = ?";
  db.query(sql, [id], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.send(result);
    }
  })
})

app.post('/findcoursework', (req, res) => {
  var code = req.body.class_code;
  var sql = "SELECT * FROM coursework WHERE class_code = ?";
  db.query(sql, [code], function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
    }
  })
})

app.post('/attendancedata', (req, res) => {
  var student_id = req.body.student_id;

  var sql = "SELECT attendance.attended, lecture_sessions.class_code FROM attendance INNER JOIN lecture_sessions WHERE attendance.session_id = lecture_sessions.session_id AND attendance.student_id = ?";  
  db.query(sql, [student_id], function (err, result) {
    if (err) {
      console.log(err) } 
    else {
      console.log(result)
      res.send(result);
    }
  })
})

app.post('/getStudentGeneralInfo', (req, res) => {
  var student_id = req.body.student_id;
  var return_results = {}

  var sql = "SELECT * FROM students WHERE matric = ?"
  db.query(sql, [student_id], function (err, result) {
    if (err) {
      console.log(err) } 
    else {
      return_results.general = result
    }
  })

  var sql = "SELECT enrolment.class_code, classes.class_title FROM enrolment INNER JOIN classes WHERE classes.class_code = enrolment.class_code AND enrolment.student_matric = ?"
  db.query(sql, [student_id], function (err, result) {
    if (err) {
      console.log(err) } 
    else {
      return_results.classes = result
    }

    sql = "SELECT coursework.title FROM coursework INNER JOIN enrolment WHERE enrolment.class_code = coursework.class_code AND enrolment.student_matric = ?"
    db.query(sql, [student_id], function (err, result) {
      if (err) {
          console.log(err) } 
        else {
          return_results.coursework = result;
        }
      })
      console.log(return_results);
      res.send(return_results);
  })
})

app.get('/getClasses', (req, res) => {
  db.query("SELECT * FROM classes", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

app.post('/getStudentCoursework', (req, res) => {
  db.query("SELECT * FROM classes", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

app.get('/getClassesDates', (req, res) => {
  db.query("SELECT class_date FROM lecture_sessions", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

app.listen(3001, () => {
    console.log("Server on port 3001");
})



