import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://web-production-155f4.up.railway.app/auto-process', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    return NextResponse.json({
      status: 'ok',
      backendStatus: response.status,
      backendOk: response.ok,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        backendStatus: 'unreachable',
      },
      { status: 502 }
    );
  }
}
