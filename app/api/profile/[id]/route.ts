import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { profileService } from '@/services/profile';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDb();
    await profileService.verifyOrCreateKBA(id, body);

    return NextResponse.json(
      {
        success: true,
        message: 'updated successfully',
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
