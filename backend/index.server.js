const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// environment variables
env.config();

// middlewares
app.use(cors());
app.use(express.json());

// Routes
const dealerAuthRoutes = require('./routes/dealer.auth');
const clientAuthRoutes = require('./routes/client.auth');
const venueRoutes = require('./routes/venue');
const dealsRoutes = require('./routes/deal');

// Serve uploaded files
app.use("/public", express.static(path.join(__dirname, "uploads")));

// API routes
app.use('/api', dealerAuthRoutes);
app.use('/api', clientAuthRoutes);
app.use('/api', venueRoutes);
app.use('/api', dealsRoutes);

// ✅ Serve React frontend (build folder)
app.use(express.static(path.join(__dirname, "client/build")));

// ✅ Catch-all route for React Router (important for routes like /payment-status)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ✅ MongoDB connection
const connectDB = (dburl) => {
    return mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Database Connected');
    });
};

// ✅ Start server
const start = async () => {
    try {
        await connectDB(process.env.dburl);
        app.listen(process.env.PORT || 2000, () => {
            console.log(`Server is running on port ${process.env.PORT || 2000}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
