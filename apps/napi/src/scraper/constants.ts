export class SpecialTokens {
    static readonly NOT_FOUND = "&_NOT_FOUND";
    static readonly EMPTY = "&_EMPTY";

    static isSpecialToken(value?: string | null) {
        return value ? value.startsWith("&_") : false;
    }
}
