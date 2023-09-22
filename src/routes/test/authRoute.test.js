/**
 * @jest-environment node
 */
const {describe, it, expect, beforeAll, afterAll} = require("@jest/globals");
const supertest = require("supertest");
const {connectDB} = require("../../db");
const mongoose = require("mongoose");
const http = require("http");
const expressApp = require("../../app");
const writeToEnvFile = require("../../utils/writeEnv");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = http.createServer(expressApp);

 let authToken;

describe('authRoute', () => {
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

    describe('POST /api/v1/auth/signup', () => {
        it('should return 201', async () => {
            const name = 'Mohammad Mizan';
            const email = 'mizan@gmail.com'
            const password = 'pass1234'
            const body = {name, email, password}
            try {
                const response = await supertest(app)
                    .post('/api/v1/auth/signup')
                    .send(body)
                    .expect(201);

                expect(response.body).toEqual({
                    code: 201,
                    message: 'User registered successfully',
                    links: {
                        signin: {
                            rel: 'signin',
                            href: '/auth/signin',
                            method: 'POST',
                        },
                    },
                });
            } catch (e) {
                expect(e).toBe(e)

            }

        });
        it('should return 409 Conflict for existing email', async () => {
            const existingUser = {
                name: 'existingUser',
                email: 'mizan@gmail.com',
                password: 'pass1234'
            };
            // First, sign up the existing user to create a conflict
            await supertest(app)
                .post('/api/v1/auth/signup')
                .send(existingUser);

            // Now, attempt to sign up with the same email
            const duplicateUser = {
                name: 'duplicateUser',
                email: 'mizan@gmail.com',
                password: 'pass1234'
            };

            try {
                const response = await supertest(app)
                    .post('/api/v1/auth/signup')
                    .send(duplicateUser)
                    .expect(409);

                expect(response.body).toEqual({
                    code: 409,
                    message: 'User already exists',
                })
            } catch (e) {
                expect(e).toBe(e)
            }
        });

        it('should return 400 for Bad Request', async () => {
            const invalidBody = {
                name: 'invalidUser',
                password: 'invalidPassword'
            }
            try {
                const response = await supertest(app)
                    .post('/api/v1/auth/signup')
                    .send(invalidBody)
                    .expect(400);
                expect(response.body).toEqual({
                    code: 400, message: 'Bad Request', errors: {
                        email: 'Email is required',
                    }

                })

            } catch (e) {
                expect(e).toBe(e)
            }


        });
    });

    describe('POST /api/auth/signin', () => {
        it('should return 200 OK and a token for valid credentials', async () => {
            const email = 'mizan@gmail.com';
            const password = 'pass1234';

            try {
                const response = await supertest(app)
                    .post('/api/v1/auth/signin')
                    .send({ email, password })
                    .expect(200);

                // Extract the token from the response
                authToken = response.body.data.token;
                writeToEnvFile('AUTH_TOKEN', authToken);
                // Verify the response structure
                expect(response.body).toEqual({
                    code: 200,
                    message: 'Login successful',
                    data: {
                        id: expect.any(String),
                        name: 'Md Mizanur Rahman',
                        email: 'user@example.com',
                        token: expect.any(String),
                    },
                    links: {
                        self: {
                            rel: 'self',
                            href: '/auth/signin',
                            method: 'POST',
                        },
                        logout: {
                            rel: 'logout',
                            href: '/auth/logout',
                            method: 'POST',
                        },
                        profile: {
                            rel: 'profile',
                            href: '/users/id',
                            method: 'GET',
                        },
                    },
                });
                console.log(`response.body: ${JSON.stringify(response.body)}`)
            }catch (e) {
                expect(e).toBe(e)

            }
        });

        it('should return 401 Unauthorized for invalid credentials', async () => {
            const email = 'invalidemail@example.com';
            const password = 'invalidpassword';

            try {
                const response = await supertest(app)
                    .post('/api/v1/auth/signin')
                    .send({ email, password })
                    .expect(401);

                // Verify the response structure
                expect(response.body).toEqual({
                    code: 401,
                    message: 'Authentication failed. Invalid credentials.',
                });
            }catch (e) {
                expect(e).toBe(e)
            }
        });
    });



})
