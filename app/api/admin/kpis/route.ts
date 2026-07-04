// app/api/admin/kpis/route.ts
import { NextResponse } from 'next/server';
import { getAdminDashboardKPIs } from '@/app/admin/reports/actions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getAdminDashboardKPIs();
  if (data.success) {
    return NextResponse.json(data);
  }
  return NextResponse.json({ error: data.error }, { status: 500 });
}
