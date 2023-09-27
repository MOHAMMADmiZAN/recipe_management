# Recipe Management API

The Recipe Management API is a Node.js-based backend application designed to streamline the management of your recipe collection. Whether you're an experienced chef or a cooking enthusiast, this API provides the essential functionality to store, search, and share your favorite recipes programmatically.

## Features

- **Recipe Management:**
    - Create, update, and delete recipes.
    - Search for recipes by name
    - Retrieve recipe details.

- **Ingredient Management:**
    - Create, update, and delete ingredients.
    - Search for ingredients by name.
    - Retrieve ingredient details.

- **User Authentication:**
    - User registration and login.
    - User profile management.
    - Password change functionality.
    - User account deletion.

## Usage

The Recipe Management API can be integrated into your own applications or used with API client tools. You can programmatically interact with the API endpoints to perform various recipe and ingredient management tasks.

## Getting Started

To get started with the Recipe Management API, you'll need to set up the environment variables, configure the database, and run the server. Please refer to the provided documentation for detailed instructions on setting up and using the API.

## Environment Variables

To run the Recipe Management System, you need to configure environment variables. Create a `.env` file in the project root directory and add the following variables with appropriate values:

```env
PORT=5000
DB_CONNECTION_URL=<MongoDB Connection URL>
JWT_SECRET=<Your JWT Secret Key>
BASE_URL=<Your Base URL>
SUPER_USER=<Super User Name or ID>

# MongoDB settings
MONGO_ROOT_USERNAME=<MongoDB Root Username>
MONGO_ROOT_PASSWORD=<MongoDB Root Password>
MONGO_AUTH=<MongoDB Authentication Mechanism>
DB_NAME=<Your Database Name>

# Mongo Express settings
ME_CONFIG_MONGO_ADMIN_USERNAME=<Mongo Express Admin Username>
ME_CONFIG_MONGO_ADMIN_PASSWORD=<Mongo Express Admin Password>
ME_CONFIG_MONGO_SERVER=mongodb

```
## Docker Setup

To run the Recipe Management System, this project uses Docker Compose to manage your MongoDB and Mongo Express instances. Ensure you have Docker and Docker Compose installed on your system.

### docker-compose.yml

Here's the `docker-compose.yml` file that configures the containers for MongoDB and Mongo Express:

```yaml
version: '3.8'
services:
  # MongoDB
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      AUTH: ${MONGO_AUTH}
    ports:
      - '27017:27017'
    volumes:
      - my_mongodb_data:/data/db

  # Mongo Express
  mongo-express:
    image: mongo-express:latest
    container_name: mongo-express
    restart: always
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${ME_CONFIG_MONGO_ADMIN_USERNAME}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${ME_CONFIG_MONGO_ADMIN_PASSWORD}
      ME_CONFIG_MONGODB_SERVER: mongodb
    ports:
      - '8081:8081'
    depends_on:
      - mongodb

volumes:
  my_mongodb_data:
    driver: local
```
## `package.json`

The `package.json` file in this project contains information about the project's dependencies, scripts, and other metadata. Here's an overview of some key parts of the `package.json` file:

```json
{
  "name": "recepie",
  "version": "1.0.0",
  "description": "Recipe Management System",
  "main": "src/index.js",
  "license": "MIT",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --env=node --detectOpenHandles"
  },
  "dependencies": {
    "@jest/globals": "^29.7.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jest-mock": "^29.7.0",
    "joi": "^17.10.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.2",
    "morgan": "^1.10.0",
    "swagger-ui-express": "^5.0.0",
    "yamljs": "^0.3.0"
  },
  "devDependencies": {
    "@babel/core": "^7.22.20",
    "@babel/preset-env": "^7.22.20",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.1",
    "supertest": "^6.3.3"
  }
}
```

## Running the Application

To run the Recipe Management System, follow these steps:

1. **Clone the Repository:**

   Clone the repository to your local machine using Git:

   ```bash
   git clone https://github.com/MOHAMMADmiZAN/recipe_management.git
    ```
2. **Install the Dependencies:**

   Navigate to the project directory and install the dependencies:

   ```bash
   yarn install
   ```
3. **Configure the Environment Variables:**
4. **Start Docker Containers:**

   Start the Docker containers for MongoDB and Mongo Express:

   ```bash
   docker-compose up -d
   ```
5. **Start the Application:**

   Start the application server:

   ```bash
   yarn dev
   ```
6. **View the Application API Documentation:**

   Open your browser and navigate to `http://localhost:5000/docs/v1` to view the application.
7. **Stop the Docker Containers:**

   To stop the Docker containers, use the following command:

   ```bash
   docker-compose down
   ```
8. **Stop the Application:**

   To stop the application server, press `Ctrl + C`.
9. **Run the Tests:**

   To run the tests, use the following command:

   ```bash
   yarn test
   ```


## Upcoming Features (Roadmap)

We are actively working on enhancing the Recipe Management API to provide even more features and functionality. Here's a glimpse of what you can expect in our next release:

- **User Role Management:** Introduce user roles (e.g., admin, regular user) for more granular access control.

- **Recipe Ratings and Reviews:** Allow users to rate and review recipes to share their experiences.

- **Recipe Import/Export:** Enable importing and exporting recipes in various formats (e.g., JSON, CSV).


- **Recipe Categorization:** We're introducing a new feature to help you organize your recipes by categories. You can now group your recipes by type, cuisine, or any other category that suits your cooking style.

- **Enhanced Recipe Search:** We're improving the search functionality, allowing you to find recipes more efficiently. You can search recipes by name, ingredients, or category, making it effortless to discover your desired dishes.

- **Ingredient Association with Recipes:** Now, you can associate ingredients with recipes, making it easier to manage the ingredients needed for your favorite dishes.

- **Integration with Third-Party Services:** Integrate with popular recipe websites or apps to fetch recipes automatically.

- **Improved API Documentation:** Enhance our API documentation with more examples and usage guidelines.

Stay tuned for these exciting updates! We appreciate your support and feedback as we continue to make the Recipe Management API even better.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**MIT License**

The MIT License is a permissive open source license that allows you to use, modify, and distribute the code in both commercial and non-commercial projects. It only requires that you include the original copyright notice and disclaimers.

For more details, please refer to the [LICENSE](LICENSE) file in the project's root directory.




