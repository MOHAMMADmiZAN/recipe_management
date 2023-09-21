function errorHandler(message = 'something went wrong', status = 500) {
    const err = new Error(message);
    err.status = status;
    return err;
}

const handleErrors = (res , error, status = 500) => {
    return res.status(status).json({
        code: status,
        message: error.message,
    });
};

module.exports = {
    errorHandler,
    handleErrors,
};
