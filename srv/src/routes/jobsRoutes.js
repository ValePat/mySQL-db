const express = require('express');
const router = express.Router();
const db = require('../db/database');  // La connessione a MongoDB si farà qui
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../services/authService');
const client = require('../db/mongo-db');
const { ObjectId } = require('mongodb');

require('dotenv').config();

// Rotta di test
router.get("/", (req, res) => {
    res.status(200).send("auth route is working")
});

// Recupera tutti i lavori
router.get('/getJobs', async (req, res) => {
    const db = client.db("react_jobs");
    const limit = req.query._limit ? parseInt(req.query._limit) : 10;
    try {
        const jobsCollection = db.collection("jobs");  // Collezione MongoDB "jobs"
        const jobs = await jobsCollection.find().sort({ _id: -1 }).limit(limit).toArray();
        res.status(200).send(jobs);
    } catch (e) {
        res.sendStatus(500);
    }
});

// Recupera un lavoro specifico tramite ID
router.get('/getJobs/:id', async (req, res) => {
    const { id } = req.params;
    const db = client.db("react_jobs");
    try {
        const jobsCollection = db.collection("jobs");  // Collezione MongoDB "jobs"
        const job = await jobsCollection.findOne({ _id:  new ObjectId(id) });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).send(job);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Aggiungi un nuovo lavoro
router.post('/addJob', authenticateToken, async (req, res) => {
    const { title, type, description, location, salary, company } = req.body;
    const newJob = {
        title,
        type,
        description,
        location,
        salary,
        company_name: company.name,
        company_description: company.description,
        company_contactEmail: company.contactEmail,
        company_contactPhone: company.contactPhone,
    };

    try {
        const jobsCollection = db.collection("jobs");  // Collezione MongoDB "jobs"
        await jobsCollection.insertOne(newJob);
        res.status(201).send("Job created");
    } catch (e) {
        res.status(500).send("Error creating job:" + e);
    }
});

// Elimina un lavoro specifico tramite ID
router.delete('/deleteJob/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const db = client.db("react_jobs");

    try {
        const jobsCollection = db.collection("jobs");  // Collezione MongoDB "jobs"
        const result = await jobsCollection.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).send(`No jobs found with id: ${id}`);
        }
        res.status(200).send(`Job with id ${id} deleted successfully`);
    } catch (e) {
        res.status(500).send("Error deleting job: " + e);
    }
});

// Modifica un lavoro specifico tramite ID
router.put('/updateJob/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, type, description, location, salary, company } = req.body;
    const updatedJob = {
        title,
        type,
        description,
        location,
        salary,
        company_name: company.name,
        company_description: company.description,
        company_contactEmail: company.contactEmail,
        company_contactPhone: company.contactPhone,
    };

    try {
        const jobsCollection = db.collection("jobs");  // Collezione MongoDB "jobs"
        const result = await jobsCollection.updateOne({ _id: id }, { $set: updatedJob });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).send("Job updated successfully");
    } catch (e) {
        res.status(500).send("Error updating job: " + e);
    }
});

// Recupera la lista dei lavori inizializzati (per esempio, se hai dati pre-caricati)
router.get('/insertJobs', async (req, res) => {
    const db = client.db("react_jobs");

    const jobs = [
        {
            "id": "1",
            "title": "Senior React Developer",
            "type": "Full-Time",
            "description": "We are seeking a talented Front-End Developer...",
            "location": "Boston, MA",
            "salary": "$70K - $80K",
            "company": {
                "name": "NewTek Solutions",
                "description": "Leading technology company...",
                "contactEmail": "test@teksolutions.com",
                "contactPhone": "555-555-5555"
            }
        },
        {
            "id": "2",
            "title": "Front-End Engineer (React & Redux)",
            "type": "Full-Time",
            "description": "Join our team as a Front-End Developer in sunny Miami, FL...",
            "location": "Miami, FL",
            "salary": "$70K - $80K",
            "company": {
                "name": "Veneer Solutions",
                "description": "Creative agency...",
                "contactEmail": "contact@loremipsum.com",
                "contactPhone": "555-555-5555"
            }
        }
        // Altri lavori da inserire...
    ];

    try {
        const jobsCollection = db.collection("jobs");  // Collezione MongoDB "jobs"
        await jobsCollection.insertMany(jobs);
        res.status(201).send('All jobs inserted successfully');
    } catch (error) {
        res.status(500).send(`Error inserting jobs: ${error.message}`);
    }
});

module.exports = router;
