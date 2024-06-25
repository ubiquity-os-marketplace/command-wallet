import { http, HttpResponse } from "msw";
import { db } from "./db";

console.log("HANDLERS", process.env);
/**
 * Intercepts the routes and returns a custom payload
 */
export const handlers = [
  http.get(`${process.env.SUPABASE_URL}/rest/v1/users*`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return HttpResponse.text("", { status: 400 });
    }
    const idNumber = Number(id.match(/\d+/)?.[0]);
    return HttpResponse.json(db.users.findFirst({ where: { id: { equals: idNumber } } }));
  }),
  http.get(`${process.env.SUPABASE_URL}/rest/v1/wallets*`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return HttpResponse.text("", { status: 400 });
    }
    const idNumber = Number(id.match(/\d+/)?.[0]);
    return HttpResponse.json(db.wallets.findFirst({ where: { id: { equals: idNumber } } }));
  }),
  http.patch(`${process.env.SUPABASE_URL}/rest/v1/wallets*`, async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return HttpResponse.text("", { status: 400 });
    }
    const idNumber = Number(id.match(/\d+/)?.[0]);
    const data = (await request.json()) as object;
    return HttpResponse.json(db.wallets.update({ data, where: { id: { equals: idNumber } } }));
  }),
  http.post("https://api.github.com/repos/:owner/:repo/issues/:id/comments", () => HttpResponse.json()),
];
