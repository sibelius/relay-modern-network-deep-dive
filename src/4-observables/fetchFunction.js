// @flow
import fetchWithRetries from 'fbjs/lib/fetchWithRetries';
import type { RequestNode, Variables, CacheConfig, UploadableMap } from 'relay-runtime';

import { isMutation, getHeaders, getRequestBody, handleData } from './helpers';

// return user auth token
const getToken = () => localStorage.getItem('authToken');

const ENV = ((process.env: any): {
  GRAPHQL_URL: string,
  [key: string]: ?string,
});

/**
 * A Sink is an object of methods provided by Observable during construction.
 * The methods are to be called to trigger each event. It also contains a closed
 * field to see if the resulting subscription has closed.
 */
export type Sink<-T> = {|
  +next: T => void,
  +error: (Error, isUncaughtThrownError?: boolean) => void,
  +complete: () => void,
  +closed: boolean,
|};

const fetchFunction = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: ?UploadableMap,
  sink: Sink<any>,
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
    sink.complete();

    return;
  }

  sink.next(data);
  sink.complete();
};

export default fetchFunction;
