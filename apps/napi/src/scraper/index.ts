import { FetchError, ScraperError } from "./errors";
import * as cheerio from 'cheerio';
import { processShape, Schema } from "./versions/v1";

export async function scrape(url: string, shape: Schema): Promise<Record<string, any>> {
    try {
        const t1 = Date.now();
        const response = await fetch(url);
        if (!response.ok) {
            throw new FetchError(url, response.statusText)
        }
        const webpage = await response.text();
        const $ = cheerio.load(webpage);
        const data = await processShape(shape, $);
        const t2 = Date.now();
        return {
            data,
            $meta: {
                url,
                timestamp: new Date().toISOString(),
                took: `${(t2 - t1) / 1000} sec.`,
            }
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        throw new ScraperError('Error during scraping')
    }
}