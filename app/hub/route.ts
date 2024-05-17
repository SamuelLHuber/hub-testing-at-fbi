// declare enum HubEventType {
//     NONE = 0,
//     MERGE_MESSAGE = 1,
//     PRUNE_MESSAGE = 2,
//     REVOKE_MESSAGE = 3,
//     /**
//      * MERGE_USERNAME_PROOF - Deprecated
//      *  HUB_EVENT_TYPE_MERGE_ID_REGISTRY_EVENT = 4;
//      *  HUB_EVENT_TYPE_MERGE_NAME_REGISTRY_EVENT = 5;
//      */
//     MERGE_USERNAME_PROOF = 6,
//     /**
//      * MERGE_ON_CHAIN_EVENT - Deprecated
//      *  HUB_EVENT_TYPE_MERGE_RENT_REGISTRY_EVENT = 7;
//      *  HUB_EVENT_TYPE_MERGE_STORAGE_ADMIN_REGISTRY_EVENT = 8;
//      */
//     MERGE_ON_CHAIN_EVENT = 9
// }

import { getSSLHubRpcClient } from '@farcaster/hub-nodejs';
const fs = require('fs');

const hubRpcEndpoint = process.env.HUB_ENDPOINT!;
const client = getSSLHubRpcClient(hubRpcEndpoint);

client.$.waitForReady(Date.now() + 5000, async (e) => {
  if (e) {
    console.error(`Failed to connect to ${hubRpcEndpoint}:`, e);
    process.exit(1);
  } else {
    console.log(`Connected to ${hubRpcEndpoint}`);

    const subscribeResult = await client.subscribe({
      eventTypes: [1], // HubEventType.MERGE_MESSAGE
    });

    if (subscribeResult.isOk()) {
      const stream = subscribeResult.value;

      for await (const event of stream) {
        //fs.appendFileSync('eventstream.json', JSON.stringify(event) + '\n');

        // unfollow
        if (event.mergeMessageBody?.message?.data.type == 5) {
          console.log(event.mergeMessageBody?.message?.data);
        }  
        
        // follow
        if (event.mergeMessageBody?.message?.data.type == 6) {
          console.log(event.mergeMessageBody?.message?.data);
        }  

      }
    }

    client.close();
  }
});