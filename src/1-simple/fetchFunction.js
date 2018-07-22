// @flow
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import fetchWithRetries from 'fbjs/lib/fetchWithRetries';
import type { RequestNode, Variables, CacheConfig, UploadableMap } from 'relay-runtime';

const isMutation = (request: RequestNode) => request.operationKind === 'mutation';

// return user auth token
const getToken = () => localStorage.getItem('authToken');

const ENV = ((process.env: any): {
  GRAPHQL_URL: string,
  [key: string]: ?string,
});

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
const fetchFunction = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: ?UploadableMap,
) => {
  const body = JSON.stringify({
    query: request.text, // GraphQL text from input
    variables,
  });

  const headers = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    authorization: getToken(),
  };

  const response = await fetchWithRetries(ENV.GRAPHQL_URL, {
    method: 'POST',
    headers,
    body,
    fetchTimeout: 20000,
    retryDelays: [1000, 3000, 5000, 10000],
  });

  const data = await response.json();

  if (isMutation(request) && data.errors) {
    throw data;
  }

  return data;
};

// Create a network layer from the fetch function
const network = Network.create(fetchFunction);
const store = new Store(new RecordSource())

const environment = new Environment({
  network,
  store
});

