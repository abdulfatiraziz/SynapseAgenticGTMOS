import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable caching

export async function GET() {
  const traces = globalThis.inMemoryTraces || [];
  return NextResponse.json({ traces });
}

export async function DELETE() {
  globalThis.inMemoryTraces = [];
  return NextResponse.json({ success: true, message: 'Simulation traces cleared successfully' });
}
