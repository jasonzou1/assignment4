/*********************************************************************************
 * WEB700 – Assignment 03
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Jiasheng Zou Student ID: 141462226 Date: 6/17/2023
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const collegeData = require('./modules/collegeData'); // assuming you have a collegeData module
const { log } = require("console");
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// GET /students
app.get('/students', (req, res) => {
    const { course } = req.query;
    if (course) {
        console.log(course)
        collegeData.getStudentsByCourse(course)
            .then(students => {
                if (students.length === 0) {
                    res.json({ message: 'no results' });
                } else {
                    res.json(students);
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: 'Internal server error' });
            });
    } else {
        collegeData.getAllStudents()
            .then(students => {
                if (students.length === 0) {
                    res.json({ message: 'no results' });
                } else {
                    res.json(students);
                }
            })
            .catch(error => {
                res.status(500).json({ message: 'Internal server error' });
            });
    }
});

// GET /tas
app.get('/tas', (req, res) => {
    collegeData.getTAs()
        .then(tas => {
            if (tas.length === 0) {
                res.json({ message: 'no results' });
            } else {
                res.json(tas);
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

// GET /courses
app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(courses => {
            if (courses.length === 0) {
                res.json({ message: 'no results' });
            } else {
                res.json(courses);
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

// GET /student/num
app.get('/student/:num', (req, res) => {
    const num = req.params.num;

    collegeData.getStudentByNum(1)
        .then(student => {
            if (student) {
                res.json(student);
            } else {
                res.json({ message: 'no results' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

// GET /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

// GET /about
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

// GET /htmlDemo
app.get('/htmlDemo', (req, res) => {
    res.sendFile(__dirname + '/views/htmlDemo.html');
});

app.get("/students/add", function(req, res){
    res.sendFile(__dirname + "/views/addStudent.html");
});


// setup http server to listen on HTTP_PORT
collegeData.initialize()
    .then(() => {
        // Start the server
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch((err) => {
        console.error('Error initializing data:', err);
    });

// Rest of the route handlers
// ...

// [ no matching route ]
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.post("/students/add", function(req, res){
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    });
});
