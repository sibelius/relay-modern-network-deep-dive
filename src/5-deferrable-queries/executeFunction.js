// @flow
import type { CacheConfig, UploadableMap, Variables } from 'react-relay';
import type { RequestNode } from 'relay-runtime';
import { Observable } from 'relay-runtime';

import cacheHandler from './cacheHandler';
import batchRequestQuery from './batchRequestQuery';

/**
 * The data returned from Relay's execute function, which includes both the
 * raw GraphQL network response as well as any related client metadata.
 */
export type ExecutePayload = {|
  // The operation executed
  operation: ConcreteOperation,
  // The variables which were used during this execution.
  variables: Variables,
  // The response from GraphQL execution
  response: GraphQLResponse,
  // Default is false
  isOptimistic?: boolean,
|};

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

const executeFunction = (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: ?UploadableMap,
) => {
  return Observable.create(sink => {
    if (request.kind === 'Request') {
      cacheHandler(request, variables, cacheConfig, uploadables, sink, true);
    }

    if (request.kind === 'BatchRequest') {
      batchRequestQuery(request, variables, cacheConfig, uploadables, sink);
    }
  });
};

export default executeFunction;
