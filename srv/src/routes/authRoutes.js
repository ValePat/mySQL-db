// src/routes/emails.js
const { authenticateToken, generateAccessToken } = require ('../services/authService');
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const client = require('../db/mongo-db')
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();



router.get("/", async (req, res) => {
        try {
       
        const database = 
        
        await client.connect();
        console.log("Connected !");
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
});

router.post("/users/register", async (req, res) => {    
    try {
        await client.connect();
        const db = client.db("react_jobs");
        const usersCollection = db.collection("users");

        const hashedPassword = await bcrypt.hash(req.body.PASSWORD, 10);
        const user = { EMAIL: req.body.USER_EMAIL, USER_NAME: req.body.USER_NAME, PASSWORD: hashedPassword };
        if( await usersCollection.findOne({ EMAIL: user.EMAIL })) {userFound = true} else {userFound = false}

        const duplicate = await usersCollection.findOne({ EMAIL: user.EMAIL });
        if(userFound){
            res.status(500).send("Account già registrato");
        } else {
            const result = await usersCollection.insertOne(user);
            res.status(201).send(result);
        }
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
});

router.post("/users/login", async (req, res) => {
    
    const { USER_NAME, PASSWORD } = req.body;
    const db = client.db("react_jobs");
    const usersCollection = db.collection("users");
    const dbUser = await usersCollection.findOne({USER_NAME});

    if (dbUser === null) {
        return res.status(400).send("Cannot find user");
    }

    try {
        if (await bcrypt.compare(req.body.PASSWORD, dbUser.PASSWORD)) {
            const username = req.body.USER_NAME
            const jwtUser = { name: username }
            const accessToken = generateAccessToken(jwtUser)
            const refreshToken = jwt.sign(jwtUser, process.env.REFRESH_TOKEN_SECRET)
            // const sInsert = 'INSERT INTO AUTH (REFRESH_TOKEN) VALUES (?)';
            // await db.query(sInsert, [refreshToken]);
            //res.json({ accessToken: accessToken, refreshToken: refreshToken })

            // **Sostituzione della parte SQL con l'inserimento in MongoDB**:
            // Inserisci il refresh token nella collezione MongoDB 'refreshTokens'
            const refreshTokenCollection = db.collection("auth");
            await refreshTokenCollection.insertOne({
                USER_NAME: USER_NAME,
                refreshToken: refreshToken,
            });

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

router.get("/authorize", authenticateToken, async (req, res) => {
    res.status(201).send("Authorized");
});

router.post("/users/register", async (req, res) => {    
    try {

        await client.connect();
        const db = client.db("your_database_name");
        const usersCollection = db.collection("users");

        const hashedPassword = await bcrypt.hash(req.body.PASSWORD, 10);
        const user = { EMAIL: req.body.USER_EMAIL, USER_NAME: req.body.USER_NAME, PASSWORD: hashedPassword };
        //const sSelect = 'SELECT * FROM USERS WHERE USER_EMAIL = ?';
        //const duplicate = await db.execute(sSelect, [user.EMAIL]);

        const duplicate = await usersCollection.findOne({ EMAIL: user.EMAIL });
        if(duplicate[0].length > 0){
            res.status(500).send("Account già registrato");
        } else {
           //const sInsert = 'INSERT INTO USERS (USER_EMAIL, USER_NAME, PASSWORD) VALUES (?, ?, ?)';
            //const result = await db.execute(sInsert, [user.EMAIL, user.USER_NAME, user.PASSWORD]);
            const result = await usersCollection.insertOne(user);
            res.status(201).send(result);
        }
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
});


router.post('/users/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const db = client.db("react_jobs");

    if (!refreshToken) return res.sendStatus(401);

    try {
        
        // const sSelect = 'SELECT * FROM AUTH WHERE REFRESH_TOKEN = ?';
        // const rows = await db.query(sSelect, [refreshToken]);
        // if (rows.length === 0) {
        //     return res.status(403).send("Invalid or empty refresh token");
        // }

        // Verifica del refresh token
        const refreshTokenCollection = db.collection("auth");
        const refreshTokenDoc = await refreshTokenCollection.findOne({ refreshToken: refreshToken });

        if (!refreshTokenDoc) {
            return res.status(403).send("Invalid or empty refresh token");
        }


        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, jwtUser) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ name: jwtUser.name });
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
            res.status(200).send("Access token refreshed");
        });
    } catch (e) {
        res.status(500).send("Something went wrong" + e);
    }
});

router.delete('/users/logout', async (req, res) => {
    const tokenToDelete = req.cookies.refreshToken;
    const refreshTokenCollection = db.collection("refreshTokens");

    try {
        // Elimina il documento dalla collezione MongoDB
        const result = await refreshTokenCollection.deleteOne({ refreshToken: tokenToDelete });

        if (result.deletedCount === 1) {
            console.log('Refresh token successfully deleted from the database');
        } else {
            console.log('Refresh token not found or already deleted');
        }

        // Pulisce i cookie di accesso e refresh
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(204).send({ authenticated: false });
    } catch (e) {
        res.status(500).send(e);
    }
});


module.exports = router;
