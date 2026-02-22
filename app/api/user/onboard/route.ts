import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/server/handleError';
import { userServices } from '@/modules/users/user.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { userController } from '@/modules/users/user.controller';

// export async function PATCH(req: NextRequest) {
//   try {
//     const body = await req.json();
//     await connectDb();
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) throw new HttpError('UNAUTHORIZED');

//     const onboard = await userServices.onboard(body, session?.user);

//     return NextResponse.json(
//       {
//         success: true,
//         userId: session?.user._id,
//         workspaceId: onboard.workspaceId,
//       },
//       { status: 201 }
//     );
//   } catch (err) {
//     return handleError(err);
//   }
// }

export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const res = await userController.onboard(body);
    console.log('res', res);
    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
