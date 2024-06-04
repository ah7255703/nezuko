import winston from "winston"

class LoggerService {
    private infoLogger: winston.Logger

    constructor() {
        this.infoLogger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
            ],
        })
    }
    get info() {
        return this.infoLogger
    }
}

export default new LoggerService()