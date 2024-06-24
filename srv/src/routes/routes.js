// src/routes/emails.js
const express = require('express');
const { createContact } = require('../db/emailService');
const router = express.Router();

// Endpoint POST per creare un nuovo contatto
router.post('/', async (req, res) => {
  console.log("TEST");
  try {
    const { firstName, lastName, email } = req.body;
    console.log(req.body)
    if (!firstName || !lastName || !email) {
      return res.status(400).send('First name, last name, and email are required');
    }
    await createContact(firstName, lastName, email);
    res.status(201).send('Contact saved');
  } catch (error) {
    console.error('Error in POST /emails:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint GET di test
router.get('/test', (req, res) => {
  res.send('Email route is working');
});

module.exports = router;

