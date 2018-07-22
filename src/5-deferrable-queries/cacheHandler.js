// @flow
import RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache.js';

import type { Variables, UploadableMap, CacheConfig } from 'react-relay';

import type { RequestNode } from 'relay-runtime';

import type { ExecutePayload, Sink } from './executeFunction';

import fetchFunction from './fetchFunction';
import { isMutation, isQuery, forceFetch } from './helpers';

const oneMinute = 60 * 1000;
const relayResponseCache = new RelayQueryResponseCache({ size: 250, ttl: oneMinute });

const cacheHandler = async (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: ?UploadableMap,
  sink: Sink<ExecutePayload>,
  complete: boolean = false,
) => {
  const queryID = request.text;

  if (isMutation(request)) {
    relayResponseCache.clear();
    return fetchFunction(request, variables, cacheConfig, uploadables, sink, complete);
  }

  const fromCache = relayResponseCache.get(queryID, variables);

  if (isQuery(request) && fromCache !== null && !forceFetch(cacheConfig)) {
    sink.next(fromCache);
    if (complete) {
      sink.complete();
    }
    return fromCache;
  }

  const fromServer = await fetchFunction(request, variables, cacheConfig, uploadables, sink, complete);
  if (fromServer) {
    relayResponseCache.set(queryID, variables, fromServer);
  }

  return fromServer;
};

export default cacheHandler;
