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

router.get('/getJobs', authenticateToken, async (req, res) => {
    const limit = req.query._limit ? `LIMIT ${parseInt(req.query._limit)}` : '';
    const statement = `SELECT * FROM JOBS ORDER BY id DESC ${limit}`;
    try{
        const result = await db.execute(statement);
        res.status(200).send(result[0]);
    } catch (e) {
        res.sendStatus(500);
    }
  });
  
router.get('/getJobs/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    console.log("id")
    select = `SELECT * FROM JOBS WHERE id = ?`
    try{
        const results = await db.execute(select, [id]);
        if (results.length === 0) {
            res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).send(results[0]);
        
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/addJob', authenticateToken, async (req, res) =>{
    const { title, type, description, location, salary, company } = req.body;
    const insert = ` INSERT INTO JOBS (title, type, description, location, salary, company_name, company_description, company_contactEmail, company_contactPhone)
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try{
        const result = await db.execute(insert, [
            title,
            type,
            description,
            location,
            salary,
            company.name,
            company.description,
            company.contactEmail,
            company.contactPhone
        ]);
        res.status(201).send("Job created");
    } catch(e){
        res.status(500).send("Error creating job:" + e);
    }
});

router.delete('/deleteJob/:id', authenticateToken, async (req, res) => {
    const {id} = req.params;
    console.log(id);
    const statement = ` DELETE FROM JOBS WHERE id = ?`;
    try {
        const result = await db.execute(statement, [id]);
        console.log(result);
        if(result[0].affectedRows === 0) {
            res.status(500).send("No jobs where found with id:" + id);
        }
        res.sendStatus(200);
    } catch (e){
        res.status(500).send("Error deleting job" + e);
    }
});

router.put('/updateJob/:id', authenticateToken, async (req, res) => {
    const {id} = req.params;
    const { title, type, description, location, salary, company } = req.body;
    const statement = `
        UPDATE JOBS
        SET title = ?, type = ?, description = ?, location = ?, salary = ?,
            company_name = ?, company_description = ?, company_contactEmail = ?, company_contactPhone = ?
        WHERE id = ?
    `;

    try{
        const result = await db.execute(statement, [
            title,
            type,
            description,
            location,
            salary,
            company.name,
            company.description,
            company.contactEmail,
            company.contactPhone,
            id
        ]);
        if (result.length === 0) {
            res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).send(result);
    } catch(e){
        res.status(500).send("Error deleting job with id:" + id)
    }
})

router.get('/createJobsTable', async (req, res) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS JOBS (
            id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            location VARCHAR(255) NOT NULL,
            salary VARCHAR(255) NOT NULL,
            company_name VARCHAR(255) NOT NULL,
            company_description TEXT NOT NULL,
            company_contactEmail VARCHAR(255) NOT NULL,
            company_contactPhone VARCHAR(255) NOT NULL
        )
    `;

    try {
        const result = await db.execute(createTableQuery);
        res.status(201).send('Jobs table created successfully' + result);
    } catch (error) {
        res.status(500).send(`Error creating jobs table: ${error.message}`);
    }
});

router.get('/insertJobs', async (req, res) => {
    try {
        const insertQuery = `
            INSERT INTO JOBS (id, title, type, description, location, salary, company_name, company_description, company_contactEmail, company_contactPhone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (const job of jobs.jobs) {
            const { id, title, type, description, location, salary, company } = job;
            const result = await db.execute(insertQuery, [
                id,
                title,
                type,
                description,
                location,
                salary,
                company.name,
                company.description,
                company.contactEmail,
                company.contactPhone
            ]);
        }

        res.status(201).send('All jobs inserted successfully');
    } catch (error) {
        res.status(500).send(`Error inserting jobs: ${error.message}`);
    }
});


module.exports = router;

/* const jobs = {
    "jobs": [
      {
        "id": "1",
        "title": "Senior React Developer",
        "type": "Full-Time",
        "description": "We are seeking a talented Front-End Developer to join our team in Boston, MA. The ideal candidate will have strong skills in HTML, CSS, and JavaScript, with experience working with modern JavaScript frameworks such as React or Angular.",
        "location": "Boston, MA",
        "salary": "$70K - $80K",
        "company": {
          "name": "NewTek Solutions",
          "description": "NewTek Solutions is a leading technology company specializing in web development and digital solutions. We pride ourselves on delivering high-quality products and services to our clients while fostering a collaborative and innovative work environment.",
          "contactEmail": "test@teksolutions.com",
          "contactPhone": "555-555-5555"
        }
      },
      {
        "id": "2",
        "title": "Front-End Engineer (React & Redux)",
        "type": "Full-Time",
        "description": "Join our team as a Front-End Developer in sunny Miami, FL. We are looking for a motivated individual with a passion for crafting beautiful and responsive web applications. Experience with UI/UX design principles and a strong attention to detail are highly desirable.",
        "location": "Miami, FL",
        "salary": "$70K - $80K",
        "company": {
          "name": "Veneer Solutions",
          "description": "Veneer Solutions is a creative agency specializing in digital design and development. Our team is dedicated to pushing the boundaries of creativity and innovation to deliver exceptional results for our clients.",
          "contactEmail": "contact@loremipsum.com",
          "contactPhone": "555-555-5555"
        }
      },
      {
        "id": "3",
        "title": "React.js Dev",
        "type": "Full-Time",
        "location": "Brooklyn, NY",
        "description": "Are you passionate about front-end development? Join our team in vibrant Brooklyn, NY, and work on exciting projects that make a difference. We offer competitive compensation and a collaborative work environment where your ideas are valued.",
        "salary": "$70K - $80K",
        "company": {
          "name": "Dolor Cloud",
          "description": "Dolor Cloud is a leading technology company specializing in digital solutions for businesses of all sizes. With a focus on innovation and customer satisfaction, we are committed to delivering cutting-edge products and services.",
          "contactEmail": "contact@dolorsitamet.com",
          "contactPhone": "555-555-5555"
        }
      },
      {
        "id": "4",
        "title": "React Front-End Developer",
        "type": "Part-Time",
        "description": "Join our team as a Part-Time Front-End Developer in beautiful Pheonix, AZ. We are looking for a self-motivated individual with a passion for creating engaging user experiences. This position offers flexible hours and the opportunity to work remotely.",
        "location": "Pheonix, AZ",
        "salary": "$60K - $70K",
        "company": {
          "name": "Alpha Elite",
          "description": "Alpha Elite is a dynamic startup specializing in digital marketing and web development. We are committed to fostering a diverse and inclusive workplace where creativity and innovation thrive.",
          "contactEmail": "contact@adipisicingelit.com",
          "contactPhone": "555-555-5555"
        }
      },
      {
        "id": "5",
        "title": "Full Stack React Developer",
        "type": "Full-Time",
        "description": "Exciting opportunity for a Full-Time Front-End Developer in bustling Atlanta, GA. We are seeking a talented individual with a passion for building elegant and scalable web applications. Join our team and make an impact!",
        "location": "Atlanta, GA",
        "salary": "$90K - $100K",
        "company": {
          "name": "Browning Technologies",
          "description": "Browning Technologies is a rapidly growing technology company specializing in e-commerce solutions. We offer a dynamic and collaborative work environment where employees are encouraged to think creatively and innovate.",
          "contactEmail": "contact@consecteturadipisicing.com",
          "contactPhone": "555-555-5555"
        }
      },
      {
        "id": "6",
        "title": "React Native Developer",
        "type": "Full-Time",
        "description": "Join our team as a Front-End Developer in beautiful Portland, OR. We are looking for a skilled and enthusiastic individual to help us create innovative web solutions. Competitive salary and great benefits package available.",
        "location": "Portland, OR",
        "salary": "$100K - $110K",
        "company": {
          "name": "Port Solutions INC",
          "description": "Port Solutions is a leading technology company specializing in software development and digital marketing. We are committed to providing our clients with cutting-edge solutions and our employees with a supportive and rewarding work environment.",
          "contactEmail": "contact@ipsumlorem.com",
          "contactPhone": "555-555-5555"
        }
      },
      {
        "id": "afd2",
        "title": "test",
        "type": "Full-Time",
        "description": "test",
        "location": "test",
        "salary": "Under $50K",
        "company": {
          "name": "test",
          "description": "test",
          "contactEmail": "test@test",
          "contactPhone": "test"
        }
      }
    ]
  }; */
