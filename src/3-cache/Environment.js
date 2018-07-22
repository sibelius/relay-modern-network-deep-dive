// @flow
// import { installRelayDevTools } from 'relay-devtools';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import RelayNetworkLogger from 'relay-runtime/lib/RelayNetworkLogger';

import cacheHandler from './cacheHandler';

const network = Network.create(
  process.env.NODE_ENV === 'development'
    ? RelayNetworkLogger.wrapFetch(cacheHandler)
    : cacheHandler,
);

const source = new RecordSource();
const store = new Store(source);

const env = new Environment({
  network,
  store,
});

export default env;
