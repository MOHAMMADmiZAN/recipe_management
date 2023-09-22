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
const {verify} = require("jsonwebtoken");
const {decodeToken} = require("../../utils/JwtTokenUtil");
const {status} = require("express/lib/response");
const PORT = process.env.PORT || 5000;
const app = http.createServer(expressApp);
dotenv.config();
const authToken = process.env.AUTH_TOKEN


let userId;
// Verify and decode the token


describe("userRoute", () => {
    beforeAll(async () => {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
            const decodedToken = await decodeToken(authToken);

            userId = decodedToken.id;
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
        } catch (e) {
            console.log(`Error: ${e.message}`)
        }

    })

    describe("PUT /api/v1/users/:userId", () => {
        it('should return 200 OK and the updated user profile', async () => {
            try {
                const updatedUserData = {
                    name: 'user123'
                };

                // Send a PUT request to update the user's profile
                const response = await supertest(app)
                    .put(`/api/v1/users/${userId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(updatedUserData)
                    .expect(200);

                // Define the expected response structure
                const expectedResponse = {
                    code: 200,
                    message: 'User Updated Successfully',
                    data: {
                        id: userId,
                        name: 'user123',
                        roles: ['user'],
                        email: 'mizan@gmail.com'
                    },
                    links: {
                        self: {
                            rel: 'self',
                            href: `/users/${userId}`,
                            method: 'GET',
                        },
                        update: {
                            rel: 'update',
                            href: `/users/${userId}`,
                            method: 'PUT',
                        },
                        delete: {
                            rel: 'delete',
                            href: `/users/${userId}`,
                            method: 'DELETE',
                        },
                    },
                };

                // Check the status code and response body against the expected response
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedResponse);
            } catch (error) {
                // Handle any errors that occur during the test
                throw error;
            }
        });


        it('should return 401 Unauthorized for an unauthorized request', async () => {
            try {
                // Create a request without providing the Authorization header
                const response = await supertest(app)
                    .put('/api/v1/users/' + userId) // Use a valid user ID here
                    .expect(401);

                // Check the response body for the expected message
                expect(response.body).toEqual({
                    code: 401,
                    message: 'Unauthorized',
                });
            } catch (error) {
                // Handle any errors that occur during the test
                throw error;
            }
        });


    });
    describe("PATCH /api/v1/users/:userId/password", () => {
        it('should return 200 OK and the updated user profile after changing password', async () => {
                try {
                    const newPasswordData = {
                        currentPassword: 'pass1234',
                        newPassword: 'pass1234',
                    };

                    console.log(userId)

                    // Send a PUT request to update the user's password
                    const response = await supertest(app)
                        .patch(`/api/v1/users/${userId}/password`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(newPasswordData)
                        .expect(200);

                    // Define the expected response structure after updating the password
                    const expectedUpdatedUserProfile = {
                        code: 200,
                        message: 'User password updated successfully',
                        data: {
                            name: 'user123',
                            id: userId,
                            email: 'mizan@gmail.com',
                            roles: ['user'],
                        },
                        links: {
                            self: {
                                rel: 'self',
                                href: `/users/${userId}`,
                                method: 'GET',
                            },
                            update: {
                                rel: 'update',
                                href: `/users/${userId}`,
                                method: 'PUT',
                            },
                            delete: {
                                rel: 'delete',
                                href: `/users/${userId}`,
                                method: 'DELETE',
                            },
                        },
                    };

                    // Check the status code and response body against the expected user profile data after changing the password
                    expect(response.status
                    ).toBe(200);
                    expect(response.body).toEqual(expectedUpdatedUserProfile);
                } catch
                    (error) {
                    // Handle any errors that occur during the test
                    throw error;
                }
            }
        )

        it('should return 401 Unauthorized for an unauthorized request', async () => {
            try {
                // Create a request without providing the Authorization header
                const response = await supertest(app)
                    .put('/api/v1/users/' + userId) // Use a valid user ID here
                    .expect(401);

                // Check the response body for the expected message
                expect(response.body).toEqual({
                    code: 401,
                    message: 'Unauthorized',
                });
            } catch (error) {
                // Handle any errors that occur during the test
                throw error;
            }
        });


    })

    /** DELETE TODO */
    describe("GET /api/v1/users/:userId", () => {
        it('should return 200 OK and the user profile', async () => {
            try {

                // Send a GET request to retrieve the user's profile
                const response = await supertest(app)
                    .get(`/api/v1/users/${userId}`)
                    .expect(200);

                // Define the expected response structure for the user profile
                const expectedUserProfile = {
                    code: 200,
                    message: 'User data retrieved successfully',
                    data: {
                        email: 'mizan@gmail.com',
                        name: expect.any(String),
                        id: userId,
                        roles: ['user'],
                    },
                    links: {
                        self: {
                            rel: 'self',
                            href: `/users/${userId}`,
                            method: 'GET',
                        },
                        update: {
                            rel: 'update',
                            href: `/users/${userId}`,
                            method: 'PUT',
                        },
                        delete: {
                            rel: 'delete',
                            href: `/users/${userId}`,
                            method: 'DELETE',
                        },
                    },
                };

                // Check the status code and response body against the expected user profile data
                expect(response.status).toBe(200);
                expect(response.body).toEqual(expectedUserProfile);
            } catch (error) {
                // Handle any errors that occur during the test
                throw error;
            }
        });
    });


})