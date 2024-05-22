import { NextRequest, NextResponse } from "next/server"

type Params = {}

// GET access token 
export function GET(req: NextRequest, context: { params: Params }) {
    return NextResponse.json({
        accessToken: req.cookies.get("accessToken")?.value,
        refreshToken: req.cookies.get("refreshToken")?.value
    })
}