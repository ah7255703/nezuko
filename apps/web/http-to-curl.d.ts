declare module "fetch-to-curl" {
    export function fetchToCurl(url: string, options: RequestInit): string;
}