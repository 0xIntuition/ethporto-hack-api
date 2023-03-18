import { ActionArgs, json } from "@remix-run/node";
import {
  ZkConnect,
  ZkConnectServerConfig,
  DataRequest,
} from "@sismo-core/zk-connect-server";
import { cors } from "remix-utils";

require("dotenv").config();

if (!process.env.SISMO_APP_ID) {
  throw new Error("SISMO_APP_ID is not defined in the environment variables");
}

if (!process.env.SISMO_GROUP_ID) {
  throw new Error("SISMO_GROUP_ID is not defined in the environment variables");
}

const devModeAddresses = {
  "0x69420cc9b83d641470d0fea1cbf1a59d7a83df48": true,
};

const HydraS2VerifierOpts = {
  isDevMode: true,
};

const VerifierOpts = {
  hydraS2: HydraS2VerifierOpts,
  isDevMode: true,
};

const zkConnectConfig: ZkConnectServerConfig = {
  // you will need to register an appId in the Factory
  appId: process.env.SISMO_APP_ID,
  devMode: {
    enabled: true, // will use the Dev Sismo Data Vault https://dev.vault-beta.sismo.io/
  },
  options: {
    verifier: VerifierOpts,
  },
};

const dataRequest = DataRequest({ groupId: process.env.SISMO_GROUP_ID });

export const loader = async () => {
  return json({ ok: true });
};
// Handles a post request to /api/verify
export const action = async ({ request }: ActionArgs) => {
  const requestData = await request.json();

  // create a new ZkConnect instance with the server configuration
  const zkConnect = ZkConnect(zkConnectConfig);

  const zkConnectResponse = requestData.zkConnectResponse;

  const { vaultId, verifiedStatements } = await zkConnect.verify(
    zkConnectResponse,
    { dataRequest: dataRequest }
  );

  const proofId = verifiedStatements[0].proofId;

  return await cors(
    request,
    json({
      ok: true,
      proofId: proofId,
    }),
    {
      allowedHeaders: ["content-type"],
    }
  );
};
