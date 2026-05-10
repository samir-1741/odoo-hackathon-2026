const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // If status code is 200, but there's an error, set to 500, else use current status code
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Custom MySQL error handling (e.g. duplicate key)
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = 'A record with that value already exists.';
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
