// @flow
// import { installRelayDevTools } from 'relay-devtools';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import RelayNetworkLogger from 'relay-runtime/lib/RelayNetworkLogger';

import executeFunction from './executeFunction';

const network = Network.create(
  process.env.NODE_ENV === 'development'
    ? RelayNetworkLogger.wrapFetch(executeFunction)
    : executeFunction,
);

const source = new RecordSource();
const store = new Store(source);

const env = new Environment({
  network,
  store,
});

export default env;
