import { NextResponse } from "next/server";

export async function GET() {
    const timestamp = new Date().toLocaleString();
    console.log(`Cron executed at: ${timestamp}`);

    return NextResponse.json({ message: "Hello, World! This is CRON route.", timestamp });
}