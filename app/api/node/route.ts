/**
 * @file app/api/user.ts
 * @description
 * Controller / Action layer for handling HTTP requests.
 *
 * Responsibilities:
 *  - Receives HTTP requests (req) and returns HTTP responses (res).
 *  - Calls service methods to perform business logic.
 *  - Handles HTTP status codes and error responses.
 *
 * Folder: `actions/`
 * Should NOT contain business logic or direct database queries.
 */

import { userService } from '@/services/node';

const mockProducts = [
  { id: 1, name: 'Next.js Mug', price: 12.99 },
  { id: 2, name: 'React Hoodie', price: 49.99 },
  { id: 3, name: 'TypeScript Stickers', price: 5.5 },
];

export async function GET() {
  return new Response(JSON.stringify(mockProducts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request) {
  // Get the JSON body from the request
  const body = await request.json();

  // Example: read a "name" field
  const { name } = body;
  await userService.createNode();
  console.log(body);

  // Create a simple message
  const message = `Hello, ${name || 'stranger'} 👋`;

  // Return a JSON response
  return new Response(JSON.stringify({ message }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
