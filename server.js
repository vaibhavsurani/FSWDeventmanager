const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_events', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Connected to MongoDB');
}).catch((error) => {
	console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});