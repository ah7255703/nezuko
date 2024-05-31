export class FetchError extends Error {
    constructor(url: string, statusText: string) {
        super(`Failed to fetch ${url}: ${statusText}`);
    }
}

export class ScraperError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidSchemaError extends Error {
    constructor(message: string) {
        super(message);
    }
}