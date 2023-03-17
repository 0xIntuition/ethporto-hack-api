import { json, LoaderArgs } from "@remix-run/node";


interface Poll {
    options: string[];
}

interface Polls {
    [key: string]: Poll;
}
  
const polls: Polls = {
    "this-is-an-awesome-slug": {
      options: ["Option 1", "Option 2", "Option 3"],
    },
    "yellow-paper-evm": {
        options: ["Option 1", "Option 2", "Option 3"],
    },
}

export async function loader({ request}: LoaderArgs) {
    if (request.method.toLowerCase() !== 'get') {
        return json({ error: 'Invalid request method' }, { status: 400 });
      }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug && polls[slug]) {
    return json(polls[slug]);
  } else {
    return json({ error: "Invalid slug" }, { status: 400 });
  }
}