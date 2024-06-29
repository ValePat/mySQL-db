// src/routes/emails.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../services/authService');

require('dotenv').config();

router.get("/", (req, res) => {
    res.status(200).send("auth route is working")
});

router.get("/getJobs", authenticateToken, async (req, res) => {
    console.log("Authentication successfull");
    res.sendStatus(201);
   /*  try{
        const data = await db.query('SELECT * FROM Contacts');
    }catch (e) {
        res.status(500).send(e)
    }
    res.status(201).send(data); */
});

module.exports = router;
