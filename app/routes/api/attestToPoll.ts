import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import {
  ZkConnect,
  ZkConnectServerConfig,
  DataRequest,
} from "@sismo-core/zk-connect-server";
import { cors } from "remix-utils";


const dataRequest = DataRequest({ groupId: process.env.SISMO_GROUP_ID });

export const loader = async ({ request }: LoaderArgs) => {
  return await cors(request, json({ ok: true }), {
    allowedHeaders: ["content-type"],
  });
};
// Handles a post request to /api/attestToPoll
export const action = async ({ request }: ActionArgs) => {
  const requestData = await request.json();

    // {
    //   "poll": "some-id",
    //   "option": "some-option",
    //   "proofId: "proof-id",
    //   "address": "address"
    // };

  return await cors(
    request,
    json({
      ok: true,
      txId: "placeholder",
    }),
    {
      allowedHeaders: ["content-type"],
    }
  );
};
