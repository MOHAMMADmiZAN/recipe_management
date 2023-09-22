const fs = require('fs');
const path = require('path');

/**
 * Writes or updates a key-value pair in the .env file located in the project's root folder.
 * @param {string} key - The environment variable key.
 * @param {string} value - The value to assign to the key.
 */
const writeToEnvFile = (key, value) => {
    // Define the path to the .env file in the project's root folder
    const envFilePath = path.join(process.cwd(), '.env');

    // Read the existing content of the .env file, or create an empty string if it doesn't exist
    let envFileContent = '';
    if (fs.existsSync(envFilePath)) {
        envFileContent = fs.readFileSync(envFilePath, 'utf8');
    }

    // Create or update the key-value pair in the content
    const keyValueString = `${key}=${value}\n`;
    if (envFileContent.includes(`${key}=`)) {
        // If the key already exists, update its value
        envFileContent = envFileContent.replace(new RegExp(`${key}=.+`, 'g'), keyValueString);
    } else {
        // If the key doesn't exist, append it to the content
        envFileContent += keyValueString;
        console.log('Added new key:', keyValueString)
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(envFilePath, envFileContent);

    // Read and log the contents of the .env file for verification
    // try {
    //     const updatedEnvFileContent = fs.readFileSync(envFilePath, 'utf8');
    //     console.log('Contents of .env file after update:', updatedEnvFileContent);
    // } catch (error) {
    //     console.error('Error reading .env file:', error.message);
    // }
};

module.exports = writeToEnvFile;
