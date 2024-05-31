
export type PostProcess = {
    type: "trim"
} | {
    type: "split",
    delimiter: string
}

export function postProcessText(value: string, postProcess: PostProcess) {
    if (postProcess.type === "trim") {
        return value.trim();
    }
    if (postProcess.type === "split") {
        return value.split(postProcess.delimiter).map((v) => v.trim());
    }
    return value;
}