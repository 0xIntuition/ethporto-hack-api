import { ActionArgs, json, LoaderArgs } from "@remix-run/node";

interface Poll {
  prompt: string;
  options: string[];
}

interface Polls {
  [key: string]: Poll;
}

const polls: Polls = {
  "/en/developers/tutorials/hello-world-smart-contract/": {
    prompt: "How helpful did you find this tutorial?",
    options: ["Very helpful", "Somewhat helpful", "Not helpful"],
  },
};

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const slugComponent = searchParams.get("slug");
  const slug = slugComponent ? decodeURIComponent(slugComponent) : null;
  console.log("slug", slug);
  console.log("polls", polls);
  console.log("polls[slug]", polls[slug!]);
  if (slug && polls[slug] !== null) {
    return json(polls[slug]);
  } else {
    return json({ error: "Invalid slug" }, { status: 400 });
  }
}
