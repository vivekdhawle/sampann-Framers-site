class apiError extends Error{
    constructor({
        statusCode,
        message="something is wrong",
        stack="",
        errors=[]
    }){
        super(message)
        this.statusCode=statusCode
        this.errors=errors
        this.success=false
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {apiError}