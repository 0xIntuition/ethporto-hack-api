import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import {
  ZkConnect,
  ZkConnectServerConfig,
  DataRequest,
} from "@sismo-core/zk-connect-server";
import { cors } from "remix-utils";
import { ethers, ZeroHash } from "ethers";

require("dotenv").config();

if (!process.env.INTUITION_RELAYER_PRIVATE_KEY) {
  throw new Error(
    "INTUITION_RELAYER_PRIVATE_KEY is not defined in the environment variables"
  );
}

if (!process.env.INTUITION_WRAPPER_CONTRACT_ADDRESS) {
  throw new Error(
    "INTUITION_WRAPPER_CONTRACT_ADDRESS is not defined in the environment variables"
  );
}

if (!process.env.RPC_URL) {
  throw new Error("RPC_URL is not defined in the environment variables");
}

// Handles a get request to /api/attestToPoll
export const loader = async ({ request }: LoaderArgs) => {
  return await cors(request, json({ ok: true }), {
    allowedHeaders: ["content-type"],
  });
};

import { abi as pollAttestContractABI } from "../../lib/wrapperContractABI/PollAttest.json";
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const relayerWallet = new ethers.Wallet(
  process.env.INTUITION_RELAYER_PRIVATE_KEY,
  provider
);

const pollAttestContract = new ethers.Contract(
  process.env.INTUITION_WRAPPER_CONTRACT_ADDRESS,
  pollAttestContractABI,
  relayerWallet
);

async function voteOnPoll(user: string, option: string, poll: string) {
  try {
    // v r s is standin
    const tx = await pollAttestContract.voteOnPoll(
      user,
      option,
      poll,
      "0",
      ZeroHash,
      ZeroHash,
      ZeroHash
    );
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Vote submitted");
    return tx.hash;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Handles a post request to /api/attestToPoll
export const action = async ({ request }: ActionArgs) => {
  const requestData = await request.json();
  console.log("poll: ", requestData.poll);
  console.log("option: ", requestData.option);
  console.log("proofId: ", requestData.proofId);
  console.log("address: ", requestData.address);

  const txHash = await voteOnPoll(
    requestData.address,
    requestData.option,
    requestData.poll
  );

  return await cors(
    request,
    json({
      ok: true,
      txId: txHash,
    }),
    {
      allowedHeaders: ["content-type"],
    }
  );
};
