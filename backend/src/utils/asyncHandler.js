
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        req.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    } 
 }           // async handler is a high order function that takes a function as an argument and returns a new function that wraps the original function in a try-catch block to handle errors in async 



export { asyncHandler }
