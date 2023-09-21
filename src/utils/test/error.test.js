const { errorHandler, handleErrors } = require('../error');
const {describe,it,expect}= require('@jest/globals');


describe('errorHandler', () => {
    it('should return an error object with default message and status', () => {
        const error = errorHandler();

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('something went wrong');
        expect(error.status).toBe(500);
    });

    it('should return an error object with the specified message and status', () => {
        const customMessage = 'Custom error message';
        const customStatus = 400;

        const error = errorHandler(customMessage, customStatus);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(customMessage);
        expect(error.status).toBe(customStatus);
    });
});

describe('handleErrors', () => {
    it('should respond with the provided status and error message', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        handleErrors(res, errorHandler('Error message', 400), 400);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ code: 400, message: 'Error message' });
    });
});
