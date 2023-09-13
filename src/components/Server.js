// server.js

// mongodb+srv://kumarvinay8209:%40%401Rajasthan@cluster1.tyhv8ad.mongodb.net/?retryWrites=true&w=majority
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
// require('dotenv').config();

// const nodemailer = require('nodemailer');
const port = 5000;
mongoose
    .connect('mongodb+srv://kumarvinay8209:%40%401Rajasthan@cluster1.tyhv8ad.mongodb.net/DoctorsData', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

const dataSchema = new mongoose.Schema({
    content: Array

});

app.use(express.static('public'));
app.use(cors()); // Enable CORS

// Enable file uploads
app.use(fileUpload());

// Parse incoming request bodies

//////////////////////////////

// mail
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// app.post('/api/data', (req, res) => {
//     const { name, email, phone, message } = req.body;

//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: 'your-email@gmail.com',
//         to: 'kumarvinay8209@gmail.com',
//         subject: 'Contact Form Submission',
//         text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Error sending email');
//         } else {
//             console.log('Email sent: ' + info.response);
//             res.status(200).send('Email sent successfully');
//         }
//     });
// });
//   mail


// app.get('/api/collections', async (req, res) => {
//     try {
//         const collections = await mongoose.connection?.db.listCollections().toArray();
//         const collectionData = {};

//         // Iterate through collection names and fetch data for each collection
//         for (const collection of collections) {
//             const collectionName = collection.name;
//             const collectionModel = mongoose.model(collectionName, new mongoose.Schema({}));
//             const data = await collectionModel.find({}).exec();
//             collectionData[collectionName] = data;
//         }

//         res.json(collectionData);
//     } catch (error) {
//         console.error('Error retrieving collections:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app.get('/api/collections', async (req, res) => {
    try {
        const collections = await mongoose.connection?.db?.listCollections().toArray();
        const collectionData = {};

        // Iterate through collection names and fetch data for each collection
        for (const collection of collections) {
            const collectionName = collection.name;

            // Check if the model already exists
            const existingModel = mongoose.models[collectionName];

            // If the model doesn't exist, create a new one
            const collectionModel = existingModel || mongoose.model(collectionName, new mongoose.Schema({}));

            const data = await collectionModel.find({}).exec();
            collectionData[collectionName] = data;
        }

        res.json(collectionData);
    } catch (error) {
        console.error('Error retrieving collections:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







// // retreaving the data from the database
app.get('/api/data', (req, res) => {
    const serializedCurrentUser = req.query.currentUser;
    const currentUser = JSON.parse(decodeURIComponent(serializedCurrentUser));
    if (currentUser) {
        const collectionName = currentUser.email;
        const UserModel = mongoose.model(`${collectionName}`, dataSchema);
        if (UserModel) {
            UserModel.find({})
                .then(data => {
                    if (data) {
                        res.json(data);
                        // console.log(data);
                    } else {
                        console.log("No data");
                        res.json({});
                    }
                })
                .catch(error => {
                    console.error('Error retrieving data:', error);
                    res.sendStatus(500);
                });
        } else {
            console.error('Error creating UserModel');
        }
    }
});


// ??????????????????????????????????????????

// send the content data to the database
// app.post('/api/data', (req, res) => {
//     const { data,tasks, currentUser } = req.body;
//     console.log(tasks)
//     if (data) {
//         const collectionName = currentUser.email;
//         const UserModel = mongoose.model(collectionName, dataSchema);
//         UserModel
//             .deleteMany({})
//             .then(() => {
//                 const newData = new UserModel({ content: [data] });
//                 return newData.save();
//             })
//             .then(() => {
//                 console.log('data server saved successfully');
//                 res.sendStatus(200);
//                 // console.log(currentUser.uid)
//             })
//             .catch((err) => {
//                 console.error('Error saving data to MongoDB', err);
//                 res.sendStatus(500);
//             });
//     }
// });

// send the content data to the database
app.post('/api/data', (req, res) => {
    const { data, currentUser } = req.body;
    if (data) {
        const collectionName = currentUser.email;
        const UserModel = mongoose.model(collectionName, dataSchema);
        if (UserModel) {
            // Use the UserModel for database operations
            UserModel.findOneAndUpdate(
                {},
                { content: [data] }, // Replace existing content array with new array
                { new: true, upsert: true }
            )
                .then(() => {
                    console.log('Data saved successfully');
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.error('Error saved data in MongoDB', err);
                    res.sendStatus(500);
                });
        } else {
            console.error('Error creating UserModel');
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});