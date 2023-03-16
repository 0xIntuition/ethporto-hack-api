import { ActionArgs, json } from "@remix-run/node";

// Handles a post request to /api/verify
export const action = async ({ request }: ActionArgs) => {
  return json({ ok: true });
};
