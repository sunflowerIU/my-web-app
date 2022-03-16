class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        
        this.statusCode = String(statusCode);
        this.status = this.statusCode.startsWith('4') ? 'Failed' : 'Error'
        this.isOperational = true

        Error.captureStackTrace(this,this.contructor)  //in stack trace this will show the exact location of error in our code
    }
}

module.exports = AppError