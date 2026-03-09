# implement the "OAuth Client" approach your manager wants, you are essentially building a Machine-to-Machine (M2M) authentication layer.

In Next-Auth, signIn() is for humans using a browser. For an AI (external client), we need a Server-to-Server flow. Here are the exact, step-by-step instructions.

## Step 1: The MongoDB Model

You need a collection to store the "IDs" of the external websites/AIs that are allowed to talk to you.
File: models/OAuthClient.ts

```Typescript
import mongoose, { Schema, model, models } from 'mongoose';

const OAuthClientSchema = new Schema({
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true }, // Store as SHA-256 hash
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The "Owner"
  name: { type: String, required: true }, // e.g., "Mondrey AI Agent"
  createdAt: { type: Date, default: Date.now },
});

export default models.OAuthClient || model('OAuthClient', OAuthClientSchema);
```

## Step 2: The "Registration" (How to create the Client)

Before the AI can talk to you, you (the Admin) must generate credentials for it. You can do this via a script or a hidden API route.
File: `lib/create-client.ts` (A utility script)

```Typescript
import { randomBytes, createHash } from 'crypto';
import dbConnect from './db';
import OAuthClient from '@/models/OAuthClient';

export async function createNewOAuthClient(name: string, ownerUserId: string) {
  await dbConnect();

  // 1. Create unique credentials
  const clientId = `client_${randomBytes(8).toString('hex')}`;
  const rawSecret = `secret_${randomBytes(32).toString('hex')}`;

  // 2. Hash the secret before saving
  const hashedSecret = createHash('sha256').update(rawSecret).digest('hex');

  // 3. Save to MongoDB
  await OAuthClient.create({
    clientId,
    clientSecret: hashedSecret,
    userId: ownerUserId, // The AI acts as this user
    name
  });

  // 4. IMPORTANT: Return the RAW secret so you can give it to the AI dev
  return { clientId, rawSecret };
}
```

## Step 2: Create the "Token Issuer" Route

This is the "OAuth stuff". The external AI will call this route once to exchange its clientId and clientSecret for a temporary access_token.

File: `app/api/oauth/token/route.ts`

```Typescript
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import OAuthClient from '@/models/OAuthClient';

export async function POST(req: Request) {
  const { clientId, clientSecret } = await req.json();

  await dbConnect();

  // 1. Hash the incoming secret to compare it
  const hashedSecret = createHash('sha256').update(clientSecret).digest('hex');

  // 2. Find the client in DB
  const client = await OAuthClient.findOne({ clientId, clientSecret: hashedSecret });

  if (!client) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  }

  // 3. Generate a JWT (The Access Token)
  // We include the userId so the API knows WHO this AI is acting as
  const accessToken = jwt.sign(
    { sub: client.userId, type: 'm2m' },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: '1h' } // Token dies in 1 hour (Safety first!)
  );

  return NextResponse.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600
  });
}
```

### Step 3: Update your ensureAuthenticated

Now your "Guard" needs to understand both Cookies (Next-Auth) and JWTs (the AI).
File: `lib/auth-guard.ts` (or wherever your function lives)

```Typescript
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function ensureAuthenticated() {
  const headerStore = await headers();
  const authHeader = headerStore.get('authorization');

  // --- LOGIC FOR AI (OAUTH TOKEN) ---
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      // Verify the JWT using your NextAuth Secret
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as any;

      const user = await User.findById(decoded.sub).lean();
      if (!user) throw new Error();

      return { user, type: 'oauth' };
    } catch (err) {
      throw new Error('UNAUTHORIZED: Invalid Token');
    }
  }

  // --- LOGIC FOR USERS (COOKIES) ---
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('UNAUTHORIZED: No Session');
  }

  return { user: session.user, type: 'session' };
}
```

## Step 4: How the AI actually connects (The Flow)

1. **Preparation**: You manually give the AI a clientId and clientSecret (which you generated and saved in your MongoDB).

2. **Step A (The Handshake): The AI calls**:
   POST /api/oauth/token with { "clientId": "...", "clientSecret": "..." }
   Your server returns a long JWT string (access_token).

3. Step B (The Data Request): The AI calls your protected route:
   GET /api/projects/[ID]/nodes
   **Header**: Authorization: Bearer <the_jwt_string>

4. **Step C (The Check)**:

- Your code sees the Bearer token.
- It decodes it and finds the userId.
- It checks if that userId is a member of the project.
- Success.
