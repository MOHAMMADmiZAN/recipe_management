const http = require("http");
const expressApp = require("./app");
const dotenv = require("dotenv");
const {connectDB} = require("./db");

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(expressApp);

async function startServer() {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Server error: ${error.message}`);
    }
}

startServer();
