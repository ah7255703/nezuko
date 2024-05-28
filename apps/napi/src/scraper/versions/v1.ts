import * as cheerio from 'cheerio';
import _ from 'lodash';

type Schema = Record<string, {
    $selector: string;
    $attribute: string | "text";
} | {
    $sub: Schema,
} | {
    $getAll: boolean;
    $inShape: Schema;
    $parentSelector: string;
}>

interface Options {
    findAll: boolean;
}

async function processShape(shape: Schema, $: cheerio.CheerioAPI, opts?: Options): Promise<Record<string, any>> {
    const data: Record<string, any> = {};

    await Promise.all(_.map(shape, async (value, key) => {

        if ('$sub' in value) {
            const { $sub } = value;
            const subData = await processShape($sub, $);
            _.set(data, key, subData);
        }

        else if ('$getAll' in value && value.$getAll === true) {
            const { $inShape, $parentSelector } = value;
            _.set(data, key, []);
            const elements = $(value.$parentSelector).html()
            if (elements) {
                const ch = cheerio.load(elements);
                const children = await processShape($inShape, ch, {
                    findAll: true,
                });
                _.set(data, key, children);
            }
        }

        else if ("$selector" in value) {
            const { $attribute, $selector } = value;
            const elements = $($selector);
            if (opts && opts.findAll) {
                const values = elements.map((_, el) => {
                    return $(el).attr($attribute) || $(el).text();
                }).get()
                _.set(data, key, values);
            } else {
                const value = elements.first().attr($attribute) || elements.first().text();
                _.set(data, key, value);
            }
        }

    }));
    return data;
}


export {
    processShape,
    type Schema
}