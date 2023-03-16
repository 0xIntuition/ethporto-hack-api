import {
  ZkConnect,
  ZkConnectServerConfig,
} from "@sismo-core/zk-connect-server";

export const zkConnectConfig: ZkConnectServerConfig = {
  appId: "0x64bfa04c1a2f52d1eec81a20cceb48fd",
};

export const zkConnect = ZkConnect(zkConnectConfig);
