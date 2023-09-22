/**
 * @jest-environment node
 */
const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const supertest = require("supertest");
const {connectDB} = require("../../db");
const mongoose = require("mongoose");
const http = require("http");
const expressApp = require("../../app");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const app = http.createServer(expressApp);
dotenv.config();
const authToken = process.env.AUTH_TOKEN


let ingredientId;
describe("ingredientRoute", () => {
    beforeAll(async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        } catch (error) {
            console.error(`Server error: ${error.message}`);
        }

    })
    afterAll(async () => {
        try {
            await mongoose.disconnect()
            await mongoose.connection.close()
            await new Promise((resolve) => app.close(resolve));
            console.log('server closed')
        }catch (e) {
            console.log(`Error: ${e.message}`)
        }

    })

describe("POST /api/ingredients", () => {
    it('should return 201 Created and the created ingredient data', async () => {
        // Define the ingredient data to be sent in the request
        const ingredientData = {
            name: 'Tomato',
            description: 'A red, juicy fruit often used in salads and sauces.',
            category: 'Vegetable',
        };

        try {
            // Send a POST request to create the ingredient
            const response = await supertest(app)
                .post('/api/v1/ingredients')
                .set('Authorization', `Bearer ${authToken}`)
                .send(ingredientData)
                .expect(201);

            // Define the expected response structure
            const expectedResponse = {
                code: 201,
                message: 'Ingredient created successfully',
                data: {
                    id: expect.any(String),
                    name: 'Tomato',
                    description: 'A red, juicy fruit often used in salads and sauces.',
                    category: 'Vegetable',
                },
                links: {
                    self: {
                        rel: 'self',
                        href: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),
                        method: 'GET',
                    },
                    update: {
                        rel: 'update',
                        href: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),
                        method: 'PUT',
                    },
                    delete: {
                        rel: 'delete',
                        href: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),
                        method: 'DELETE',
                    },
                },
            };

            expect(response.body).toEqual(expectedResponse);
        } catch (error) {
            throw error;
        }
    });
    it('should return 400 on Bad Request', async () => {
        // Define the ingredient data with a missing email field
        const ingredientData = {
            description: 'A red, juicy fruit often used in salads and sauces.',
            category: 'Vegetable',
        };

        try {
            // Send a POST request to create the ingredient with missing email
            const response = await supertest(app)
                .post('/api/v1/ingredients')
                .send(ingredientData)
                .expect(400);

            const expectedResponse = {
                code: 400,
                errors: {
                        name: 'Name is required',
                    }

            };

            expect(response.body).toEqual(expectedResponse);
        } catch (error) {
            throw error;
        }
    });

})
describe("GET /api/ingredients", () => {
    it('should return a 200 OK response with the expected data structure for a single item', async () => {
        try {
            // Send a GET request to your API endpoint
            const response = await supertest(app)
                .get('/api/v1/ingredients?page=1&limit=1&search=Tomato')
                .expect(200);

            // Update the expected response structure
            const expectedResponse = {
                code: 200,
                data: [
                    {
                        _id: expect.any(String),
                        name: 'Tomato',
                        description: expect.any(String),
                        category: 'Vegetable',
                        link: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),

                    },
                ],
                links: {
                    self: "/ingredients?limit=1&sort=updatedAt&sort_type=dsc&page=1&search=Tomato",
                    next: "/ingredients?limit=1&sort=updatedAt&sort_type=dsc&page=2&search=Tomato",
                },
                message: 'Ingredients fetched successfully',
                pagination: {
                    limit: 1,
                    page: 1,
                    next: 2,
                    totalItems: expect.any(Number), // Update with the expected total items
                    totalPage: expect.any(Number), // Update with the expected total pages
                },
            };

            ingredientId = response.body.data[0]._id;

            // Check if the response matches the expected structure
            expect(response.body).toEqual(expectedResponse);
        } catch (error) {
           throw error
        }
    });
})
    describe("GET /api/ingredients/:id", () => {
        it('should return 200 and the expected ingredient data', async () => {
            try {
                const response = await supertest(app)
                    .get(`/api/v1/ingredients/${ingredientId}`)
                    .expect(200);

                const expectedResponse = {
                    code: 200,
                    message: 'Ingredient fetched successfully',
                    data: {
                        id: expect.any(String),
                        name: 'Tomato',
                        description: expect.any(String),
                        category: 'Vegetable',
                    },
                    links: {
                        self: {
                            rel: 'self',
                            href: `/ingredients/${ingredientId}`,
                            method: 'GET',
                        },
                        update: {
                            rel: 'update',
                            href: `/ingredients/${ingredientId}`,
                            method: 'PUT',
                        },
                        delete: {
                            rel: 'delete',
                            href: `/ingredients/${ingredientId}`,
                            method: 'DELETE',
                        },
                    },
                };

                // Check the status code
                expect(response.status).toBe(200);

                // Check if the response body matches the expected structure
                expect(response.body.code).toStrictEqual(expectedResponse.code);
                expect(response.body.message).toStrictEqual(expectedResponse.message);
                expect(response.body.data.name).toStrictEqual(expectedResponse.data.name);
                expect(response.body.data.description).toStrictEqual(expectedResponse.data.description);
                expect(response.body.data.category).toBe(expectedResponse.data.category);

                // Check links
                expect(response.body.links.self).toEqual(expectedResponse.links.self);
                expect(response.body.links.update).toEqual(expectedResponse.links.update);
                expect(response.body.links.delete).toEqual(expectedResponse.links.delete);
            } catch (error) {
               
                throw error;
            }
        });

        it('should return 404 for a non-existent ingredient', async () => {
            try {
                // Provide an ingredient ID that does not exist in your database
                const nonExistentIngredientId = 'E924bBfAcEb05E761E2d8Ac9';

                const response = await supertest(app)
                    .get(`/api/v1/ingredients/${nonExistentIngredientId}`)
                    .expect(404);

                const expectedResponse = {
                    code: 404,
                    message: 'Ingredient not found',
                };

                // Check the status code
                expect(response.status).toBe(404);

                // Check if the response body matches the expected structure
                expect(response.body).toEqual(expectedResponse);
            } catch (error) {
               
                throw error;
            }
        });
    });


    describe("PUT /api/ingredients/:id", () => {
        it('should return 200 OK and the updated ingredient data', async () => {
            try {
                // Define the updated ingredient data
                const updatedIngredientData = {
                    name: 'Updated Tomato',
                    description: 'A freshly updated tomato.',
                    category: 'Vegetable',
                };

                // Send a PUT request to update the ingredient
                const response = await supertest(app)
                    .put(`/api/v1/ingredients/${ingredientId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updatedIngredientData)
                    .expect(200);

                // Define the expected response structure
                const expectedResponse = {
                    code: 200,
                    message: 'Ingredient updated successfully',
                    data: {
                        id: expect.any(String),
                        name: 'Updated Tomato',
                        description: 'A freshly updated tomato.',
                        category: 'Vegetable',
                    },
                    links: {
                        self: {
                            rel: 'self',
                            href: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),
                            method: 'GET',
                        },
                        update: {
                            rel: 'update',
                            href: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),
                            method: 'PUT',
                        },
                        delete: {
                            rel: 'delete',
                            href: expect.stringMatching(/\/ingredients\/[a-zA-Z0-9]+/),
                            method: 'DELETE',
                        },
                    },
                };

                // Check the status code and response body against the expected response
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponse);
            } catch (error) {
               
                throw error;
            }
        });
        it('should return 404 for a non-existent ingredient', async () => {
            try {
                // Provide an ingredient ID that does not exist in your database
                const nonExistentIngredientId = 'E924bBfAcEb05E761E2d8Ac9';

                const response = await supertest(app)
                    .put(`/api/v1/ingredients/${nonExistentIngredientId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);

                const expectedResponse = {
                    code: 404,
                    message: 'Ingredient not found',
                };

                // Check the status code
                expect(response.status).toBe(404);

                // Check if the response body matches the expected structure
                expect(response.body).toEqual(expectedResponse);
            } catch (error) {
               
                throw error;
            }
        });
    });


    describe("DELETE /api/ingredients/:id", () => {
        it('should return 200 OK and a success message', async () => {
            try {
                // Send a DELETE request to delete the ingredient
                const response = await supertest(app)
                    .delete(`/api/v1/ingredients/${ingredientId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                // Define the expected response structure
                const expectedResponse = {
                    code: 200,
                    message: 'Ingredient deleted successfully',
                };

                // Check the status code and response body against the expected response
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponse);
            } catch (error) {
               
                throw error;
            }
        });

        it('should return 404 for a non-existent ingredient', async () => {
            try {
                // Provide an ingredient ID that does not exist in your database
                const nonExistentIngredientId = 'E924bBfAcEb05E761E2d8Ac9';

                const response = await supertest(app)
                    .delete(`/api/v1/ingredients/${nonExistentIngredientId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(404);

                const expectedResponse = {
                    code: 404,
                    message: 'Requested Ingredient not found',
                };

                // Check the status code
                expect(response.status).toBe(404);

                // Check if the response body matches the expected structure
                expect(response.body).toEqual(expectedResponse);
            } catch (error) {

                throw error;
            }
        });
    });







})