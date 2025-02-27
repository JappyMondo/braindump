import { NextResponse } from "next/server";

/**
 * Health check endpoint for container orchestration and monitoring
 * @returns A simple 200 OK response with a status message
 */
export async function GET() {
  // You could add more complex health checks here:
  // - Database connectivity
  // - External service availability
  // - System metrics

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || "dev",
    },
    { status: 200 }
  );
}
