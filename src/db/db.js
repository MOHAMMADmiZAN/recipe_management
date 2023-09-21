const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set the connection options.
        const options = {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        const connectionURL = process.env.DB_CONNECTION_URL
            .replace('<username>', process.env.MONGO_ROOT_USERNAME)
            .replace('<password>', process.env.MONGO_ROOT_PASSWORD);

        // Connect to the database.
        await mongoose.connect(connectionURL, options);
        console.log('Database connected');

    } catch (error) {
        console.error('Database connection error:', error);
    }
};

module.exports = connectDB;
