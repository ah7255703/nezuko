import * as cheerio from 'cheerio';
import { PostProcess, postProcessText } from './postprocessText';
import { SpecialTokens } from './constants';

type KV = {
    $selector: string;
    $attr?: string | "text";
    $post?: PostProcess
}

type KVSub = {
    $sub: Schema;
}

type KVSubArray = {
    $parentSelector: string;
    $childrenSchema: Schema;
}
type Schema = Record<string, KV | KVSub | KVSubArray>

function handleKv(kv: KV, $: cheerio.CheerioAPI) {
    const { $selector, $attr } = kv;
    const $el = $($selector);
    let value = null;

    if ($el.length === 0) {
        value = SpecialTokens.NOT_FOUND;
    } else if ($attr === "text" || !$attr) {
        value = $el.text();
    } else {
        value = $el.attr($attr);
    }

    if (value === "" || value === null || value === undefined) {
        value = SpecialTokens.EMPTY;
    }

    if (SpecialTokens.isSpecialToken(value)) {
        return value;
    }

    if (kv.$post) {
        value = postProcessText(value, kv.$post);
    }

    return value;
}

function processSchema(schema: Schema, $: cheerio.CheerioAPI): Record<string, any> {
    let result: Record<string, any> = {};
    for (const key in schema) {
        const kv = schema[key];
        if ("$sub" in kv) {
            const { $sub } = kv;
            result[key] = processSchema($sub, $);
        }
        else if ("$parentSelector" in kv) {
            const { $parentSelector, $childrenSchema } = kv;
            let children: any[] = [];
            const $parent = $($parentSelector);
            $parent.each((_, el) => {
                const $child = $.load(el);
                children.push(processSchema($childrenSchema, $child));
            });
            result[key] = children;
        }

        else {
            result[key] = handleKv(kv as KV, $);
        }
    }
    return result;


}
export {
    processSchema,
    type Schema
}