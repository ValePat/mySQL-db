// src/routes/emails.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const { route } = require('./emails');
require('dotenv').config();

router.get("/", (req, res) => {
    res.status(200).send("auth route is working")
});

//Check authorization for ui display functionalities
router.get('/authCheck', (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  //Verifica token di refresh
  if (!refreshToken) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    //Verifica token di accesso
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (error) {
    // Se token di accesso è scaduto o invalido genera un nuovo token
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        //Verifica token di refresh
        const jwtUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        //genera nuovo token
        const newAccessToken = generateAccessToken(jwtUser);
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false });
        res.json({ authenticated: true, user: jwtUser });
      } catch (refreshError) {
        res.status(401).json({ authenticated: false });
      }
    } else {
      res.status(401).json({ authenticated: false });
    }
  }
});

//Authorize
router.get("/authorize", authenticateToken, async (req, res) => {
    res.status(201).send("Authorized");
});

//Get sensible data
router.get("/getData", authenticateToken, async (req, res) => {
    
    try{
        const data = await db.query('SELECT * FROM Contacts');
    }catch (e) {
        res.status(500).send(e)
    }
    res.status(201).send(data);
});

router.post("/users/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.PASSWORD, 10);
        const user = { EMAIL: req.body.EMAIL, USER_NAME: req.body.USER_NAME, PASSWORD: hashedPassword };
        //const sInsert = 'INSERT INTO USERS (EMAIL, USER_NAME, PASSWORD) VALUES (?, ?, ?)';
        const sInsert = 'INSERT INTO USERS (USER_NAME, PASSWORD) VALUES (?, ?)';
        //const result = await db.execute(sInsert, [user.EMAIL, user.USER_NAME, user.PASSWORD]);
        const result = await db.execute(sInsert, [user.EMAIL, user.USER_NAME, user.PASSWORD]);

        res.status(201).send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/users/login", async (req, res) => {
    
    const { USER_NAME, PASSWORD } = req.body;
    const sSelect = 'SELECT * FROM USERS WHERE USER_NAME = ?';
    const rows = await db.execute(sSelect, [USER_NAME]);
    const dbUser = rows[0];

    if (!dbUser) {
        return res.status(400).send("Cannot find user");
    }

    try {
        if (await bcrypt.compare(req.body.PASSWORD, dbUser[0].PASSWORD)) {
            const username = req.body.USER_NAME
            const jwtUser = { name: username }
            const accessToken = generateAccessToken(jwtUser)
            const refreshToken = jwt.sign(jwtUser, process.env.REFRESH_TOKEN_SECRET)
            const sInsert = 'INSERT INTO AUTH (REFRESH_TOKEN) VALUES (?)';
            await db.query(sInsert, [refreshToken]);
            //res.json({ accessToken: accessToken, refreshToken: refreshToken })
            res.cookie('accessToken', accessToken, { httpOnly: true, secure:true, sameSite: 'strict' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:true,sameSite: 'strict' });
            res.json({ authenticated: true });
        } else {
            res.send("Password non corretta");
        }
    } catch(e) {
        res.status(500).send(e);
    }
});

router.post('/users/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const sSelect = 'SELECT * FROM AUTH WHERE REFRESH_TOKEN = ?';
        const rows = await db.query(sSelect, [refreshToken]);
        if (rows.length === 0) {
            return res.sendStatus(403);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, jwtUser) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ name: jwtUser.name });
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
            res.json({ accessToken });
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/users/logout', async (req, res) => {
    const tokenToDelete = req.cookies.refreshToken;
    const sDelete = 'DELETE FROM AUTH WHERE REFRESH_TOKEN = ?';

    try {
        const result = await db.execute(sDelete, [tokenToDelete]);
        console.log('Refresh token successfully deleted from the database');

        // Clear 
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(204).send({ authenticated: false });
    } catch (e) {
        res.status(500).send(e);
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const accessToken = token || req.cookies.accessToken; // Check cookie if no auth header

    if (!accessToken) return res.status(401).send("Permission denied");

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

function generateAccessToken(jwtUser) {
    try{

        return jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
    } catch (e) {
        console.log(e)
    }
};

module.exports = router;
