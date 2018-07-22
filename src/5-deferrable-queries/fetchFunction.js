// @flow
import fetchWithRetries from 'fbjs/lib/fetchWithRetries';

import type { Variables, UploadableMap, CacheConfig } from 'react-relay';

import type { RequestNode } from 'relay-runtime';

import { handleData, getRequestBody, getHeaders, isMutation } from './helpers';
import type { Sink, ExecutePayload } from './executeFunction';

// return user auth token
const getToken = () => localStorage.getItem('authToken');

const ENV = ((process.env: any): {
  GRAPHQL_URL: string,
  [key: string]: ?string,
});


// Define a function that fetches the results of an request (query/mutation/etc)
// and returns its results as a Promise:
const fetchFunction = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: ?UploadableMap,
  sink: Sink<ExecutePayload>,
  complete: boolean = false,
) => {
  const body = getRequestBody(request, variables, uploadables);

  const headers = {
    ...getHeaders(uploadables),
    authorization: getToken(),
  };

  const response = await fetchWithRetries(ENV.GRAPHQL_URL, {
    method: 'POST',
    headers,
    body,
    fetchTimeout: 20000,
    retryDelays: [1000, 3000, 5000, 10000],
  });

  const data = await handleData(response);

  if (isMutation(request) && data.errors) {
    sink.error(data);

    if (complete) {
      sink.complete();
    }

    throw data;
  }

  sink.next({
    operation: request.operation,
    variables,
    response: data,
  });

  if (complete) {
    sink.complete();
  }

  return {
    operation: request.operation,
    variables,
    response: data,
  };
};

export default fetchFunction;
