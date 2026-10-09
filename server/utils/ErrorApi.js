export default class ErrorApi extends Error {
    constructor(status, error, detalle) {
        super(error)
        this.status = status
        this.error = error
        this.detalle = detalle
    }
}