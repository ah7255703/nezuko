import { Inter, Tajawal } from "next/font/google";

export const arabicFont = Tajawal({
    subsets: ["arabic"],
    variable: "--cairo-font",
    adjustFontFallback: false,
    display: "fallback",
    weight: "400"
});

export const latinFont = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--opensans-font",
    fallback: ["var(--cairo-font)"],
    adjustFontFallback: false,
    display: "fallback",
});