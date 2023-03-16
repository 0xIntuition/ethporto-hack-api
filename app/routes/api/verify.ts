import { ActionArgs, json } from "@remix-run/node";
import { ZkConnect, ZkConnectServerConfig, DataRequest } from "@sismo-core/zk-connect-server";


require('dotenv').config();

if (!process.env.SISMO_APP_ID) {
  throw new Error('SISMO_APP_ID is not defined in the environment variables');
}

if (!process.env.SISMO_GROUP_ID) {
  throw new Error('SISMO_GROUP_ID is not defined in the environment variables');
}

const zkConnectConfig: ZkConnectServerConfig = {
  // you will need to register an appId in the Factory
  appId: process.env.SISMO_APP_ID,
}

// create a new ZkConnect instance with the server configuration
const zkConnect = ZkConnect(zkConnectConfig);

const dataRequest = DataRequest({ groupId: process.env.SISMO_GROUP_ID});

// Handles a post request to /api/verify
export const action = async ({ request }: ActionArgs) => {
  if (request.method.toLowerCase() !== 'post') {
    return json({ error: 'Invalid request method' }, { status: 400 });
  }

  const requestData = await request.json();
  const zkConnectResponse = requestData.zkConnectResponse;

  const { vaultId, verifiedStatements } = await zkConnect.verify(
    zkConnectResponse,
    { dataRequest: dataRequest }
  );

  const proofId = verifiedStatements[0].proofId;

  return json({ 
    ok: true, 
    proofId: proofId
  });

  // do something with the proofID



};
