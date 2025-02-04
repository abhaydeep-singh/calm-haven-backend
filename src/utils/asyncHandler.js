// it helps to avoid multiple try catch blocks in controllers, every error is catched here in handler.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
 

export { asyncHandler }