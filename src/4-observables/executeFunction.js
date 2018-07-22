// @flow
import type { CacheConfig, UploadableMap, Variables } from 'react-relay';
import type { RequestNode } from 'relay-runtime';
import { Observable } from 'relay-runtime';
import fetchFunction from './fetchFunction';

const executeFunction = (
  request: RequestNode,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: ?UploadableMap,
) => {
  return Observable.create(sink => {
    fetchFunction(request, variables, cacheConfig, uploadables, sink);
  });
};

export default executeFunction;
