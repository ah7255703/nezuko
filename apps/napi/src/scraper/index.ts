import * as cheerio from "cheerio";
import { processSchema, Schema } from "./processSchema";
import { FetchError, InvalidSchemaError, ScraperError } from "./errors";

interface Options {
    url: string;
    schema: any;
    params?: Record<string, any>;
    headers?: Record<string, any>;
    method?: "GET" | "POST";
}


const validateSchema = (schema: any): schema is Schema => {
    for (const key in schema) {
        const kv = schema[key];
        if ("$sub" in kv) {
            validateSchema(kv.$sub);
        }
        else if ("$childrenSchema" in kv) {
            validateSchema(kv.$childrenSchema);
        }
        else {
            if (!("$selector" in kv)) {
                throw new Error("Missing $selector in schema");
            }
        }
    }
    return true;
}

export async function processWebpage(options: Options) {
    const { url, schema, params, headers, method } = options;
    if (!validateSchema(schema)) {
        throw new InvalidSchemaError("Invalid schema");
    }
    try {

        const response = await fetch(url, {
            method: method || "GET",
        });

        if (!response.ok) {
            throw new FetchError(url, response.statusText);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        return processSchema(schema, $);
    } catch (error) {
        if (error instanceof FetchError) {
            throw new ScraperError("Failed to fetch webpage");
        }
        throw error;
    }
}
