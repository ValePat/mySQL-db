// src/db/emailService.js
const pool = require('../db/database');

const createContact = async (firstName, lastName, email) => {
  try {
    const statement = 'INSERT INTO Contacts (FIRST_NAME, LAST_NAME, EMAIL) VALUES (?, ?, ?)';
    const [result] = await pool.execute(statement, [firstName, lastName, email]);
    return result.insertId; // Ritorna l'ID generato per l'inserimento
  } catch (error) {
    console.error('Failed to create contact:', error.message);
    throw error;
  }
};

module.exports = {
  createContact,
};
