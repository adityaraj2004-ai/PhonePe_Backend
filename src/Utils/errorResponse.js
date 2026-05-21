class ApiResponse extends Errors{
    constructor(
        statusCode,
        message,
        errors= [],
        stack = "",
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
    }
}
export {ApiResponse}