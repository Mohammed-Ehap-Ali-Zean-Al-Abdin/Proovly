import type { Client } from '@hashgraph/sdk';

// Skeleton HCS mirror listener. In production, this would connect to a mirror node or use SDK
// subscriptions to listen for messages and process them.
export function startHcsListener(client: Client | null) {
  if (!client) {
    // nothing to do in mocked/test environments
    return {
      stop: async () => {}
    };
  }

  // Example skeleton - no-op
  let running = true;
  return {
    stop: async () => {
      running = false;
    },
    running: () => running
  };
}
