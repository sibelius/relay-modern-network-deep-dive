import type {
    ConcreteFragment,
    RequestNode,
    FragmentReference,
    Environment as IEnvironment,
  } from 'relay-runtime';

declare module 'react-relay' {
  declare export type RerunParam = {
    param: string,
    import?: ?string,
    target?: ?string,
    max_runs: number,
  };

  // $FlowFixMe(>=0.66.0) this is compatible with classic api see D4658012
  declare export type Uploadable = File | Blob;
  // $FlowFixMe this is compatible with classic api see D4658012
  declare export type UploadableMap = { [key: string]: Uploadable };

  /**
   * Settings for how a query response may be cached.
   *
   * - `force`: causes a query to be issued unconditionally, irrespective of the
   *   state of any configured response cache.
   * - `poll`: causes a query to live update by polling at the specified interval
   *   in milliseconds. (This value will be passed to setTimeout.)
   * - `rerunParamExperimental`: causes the query to be run with the experimental
   *   batch API on Network interfaces and GraphQL servers that support it.
   * - `metadata`: user-supplied metadata.
   */
  declare export type CacheConfig = {
    force?: ?boolean,
    poll?: ?number,
    rerunParamExperimental?: ?RerunParam,
    metadata?: { [key: string]: mixed },
  };

  // Variables
  declare export type Variables = { [name: string]: $FlowFixMe };

  declare export type ConcreteArgument = ConcreteLiteral | ConcreteVariable;
  declare export type ConcreteArgumentDefinition =
    | ConcreteLocalArgument
    | ConcreteRootArgument;
  /**
   * An experimental wrapper around many operations to request in a batched
   * network request. The composed indivual GraphQL requests should be submitted
   * as a single networked request, e.g. in the case of deferred nodes or
   * for streaming connections that are represented as distinct compiled concrete
   * operations but are still conceptually tied to one source operation.
   *
   * Individual requests within the batch may contain data describing their
   * dependencies on other requests or themselves.
   */
  declare export type ConcreteBatchRequest = {
    kind: 'BatchRequest',
    operationKind: 'mutation' | 'query' | 'subscription',
    name: string,
    metadata: {[key: string]: mixed},
    fragment: ConcreteFragment,
    requests: Array<ConcreteBatchSubRequest>,
  };
  declare export type ConcreteBatchSubRequest = {
    name: string,
    id: ?string,
    text: ?string,
    // Arguments in the provided operation to be derived via the results of
    // other requests in this batch.
    argumentDependencies: ?Array<ArgumentDependency>,
    operation: ConcreteOperation | ConcreteDeferrableOperation,
  };
  /**
   * Argument in the provided operation to be derived via the results of
   * other requests in the batch.
   */
  declare export type ArgumentDependency = {|
    // The name of the argument to provide.
    name: string,
    // The name of the request in this batch to wait for a result from.
    // This may be the same request for recursive requests (in which case
    // the initial value will be null).
    fromRequestName: string,
    // The JSONPath into the dependent request at which the value for this
    // argument is found.
    fromRequestPath?: string,
    // Exported variable from the query this depends on. Should only use one of
    // fromRequestImport or fromRequestPath
    fromRequestImport?: string,
    // If the result is a list of values, should it use the first value, last
    // value, all values in the list, or trigger a new instance of this
    // request for each item in the list.
    ifList?: 'first' | 'last' | 'all' | 'each',
    // If the result is null, should it result in an error, allow the null
    // value to be provided, or skip execution of this request.
    ifNull?: 'error' | 'allow' | 'skip',
    // If this argument is dependent on itself, how many times may this
    // request execute before completing.
    maxRecurse?: number,
  |};
  /**
   * Represents a common GraphQL request with `text` (or persisted `id`) can be
   * used to execute it, an `operation` containing information to normalize the
   * results, and a `fragment` derived from that operation to read the response
   * data (masking data from child fragments).
   */
  declare export type ConcreteRequest = {
    kind: 'Request',
    operationKind: 'mutation' | 'query' | 'subscription',
    name: string,
    id: ?string,
    text: ?string,
    metadata: {[key: string]: mixed},
    fragment: ConcreteFragment,
    operation: ConcreteNonDeferrableOperation,
  };
  /**
   * Represents a single operation used to processing and normalize runtime
   * request results.
   */
  declare export type ConcreteOperation =
    | ConcreteNonDeferrableOperation
    | ConcreteDeferrableOperation;
  declare type ConcreteNonDeferrableOperation = {
    kind: 'Operation',
    name: string,
    argumentDefinitions: Array<ConcreteLocalArgument>,
    selections: Array<ConcreteSelection>,
  };
  declare type ConcreteDeferrableOperation = {
    kind: 'DeferrableOperation',
    name: string,
    argumentDefinitions: Array<ConcreteLocalArgument>,
    selections: Array<ConcreteSelection>,
    fragmentName: string,
    rootFieldVariable: string,
  };
  declare export type ConcreteCondition = {
    kind: 'Condition',
    passingValue: boolean,
    condition: string,
    selections: Array<ConcreteSelection>,
  };
  declare export type ConcreteField = ConcreteScalarField | ConcreteLinkedField;
  declare export type ConcreteFragment = {
    kind: 'Fragment',
    name: string,
    type: string,
    metadata: ?{[key: string]: mixed},
    argumentDefinitions: Array<ConcreteArgumentDefinition>,
    selections: Array<ConcreteSelection>,
  };
  declare export type ConcreteFragmentSpread = {
    kind: 'FragmentSpread',
    name: string,
    args: ?Array<ConcreteArgument>,
  };
  declare export type ConcreteDeferrableFragmentSpread = {
    kind: 'DeferrableFragmentSpread',
    name: string,
    args: ?Array<ConcreteArgument>,
    rootFieldVariable: string,
    storageKey: string,
  };
  declare export type ConcreteHandle = ConcreteScalarHandle | ConcreteLinkedHandle;
  declare export type ConcreteRootArgument = {
    kind: 'RootArgument',
    name: string,
    type: ?string,
  };
  declare export type ConcreteInlineFragment = {
    kind: 'InlineFragment',
    selections: Array<ConcreteSelection>,
    type: string,
  };
  declare export type ConcreteLinkedField = {
    kind: 'LinkedField',
    alias: ?string,
    name: string,
    storageKey: ?string,
    args: ?Array<ConcreteArgument>,
    concreteType: ?string,
    plural: boolean,
    selections: Array<ConcreteSelection>,
  };
  declare export type ConcreteLinkedHandle = {
    kind: 'LinkedHandle',
    alias: ?string,
    name: string,
    args: ?Array<ConcreteArgument>,
    handle: string,
    key: string,
    filters: ?Array<string>,
  };
  declare export type ConcreteLiteral = {
    kind: 'Literal',
    name: string,
    type: ?string,
    value: mixed,
  };
  declare export type ConcreteLocalArgument = {
    kind: 'LocalArgument',
    name: string,
    type: string,
    defaultValue: mixed,
  };
  declare export type ConcreteNode =
    | ConcreteCondition
    | ConcreteLinkedField
    | ConcreteFragment
    | ConcreteInlineFragment
    | ConcreteOperation
    | ConcreteDeferrableOperation;
  declare export type ConcreteScalarField = {
    kind: 'ScalarField',
    alias: ?string,
    name: string,
    args: ?Array<ConcreteArgument>,
    storageKey: ?string,
  };
  declare export type ConcreteScalarHandle = {
    kind: 'ScalarHandle',
    alias: ?string,
    name: string,
    args: ?Array<ConcreteArgument>,
    handle: string,
    key: string,
    filters: ?Array<string>,
  };
  declare export type ConcreteSelection =
    | ConcreteCondition
    | ConcreteDeferrableFragmentSpread
    | ConcreteField
    | ConcreteFragmentSpread
    | ConcreteHandle
    | ConcreteInlineFragment;
  declare export type ConcreteVariable = {
    kind: 'Variable',
    name: string,
    type: ?string,
    variableName: string,
  };
  declare export type ConcreteSelectableNode =
    | ConcreteFragment
    | ConcreteOperation
    | ConcreteDeferrableOperation;
  declare export type RequestNode = ConcreteRequest | ConcreteBatchRequest;
  declare export type GeneratedNode = RequestNode | ConcreteFragment;

  declare export type VariableMapping = { [key: string]: mixed };

  /**
   * Ideally this would be a union of Field/Fragment/Mutation/Query/Subscription,
   * but that causes lots of Flow errors.
   */
  declare export type ConcreteBatchCallVariable = {
    jsonPath: string,
    kind: 'BatchCallVariable',
    sourceQueryID: string,
  };
  declare export type ConcreteCall = {
    kind: 'Call',
    metadata: {
      type?: ?string,
    },
    name: string,
    value: ?ConcreteValue,
  };
  declare export type ConcreteCallValue = {
    callValue: mixed,
    kind: 'CallValue',
  };
  declare export type ConcreteCallVariable = {
    callVariableName: string,
    kind: 'CallVariable',
  };
  declare export type ConcreteDirective = {
    args: Array<ConcreteDirectiveArgument>,
    kind: 'Directive',
    name: string,
  };
  declare export type ConcreteDirectiveArgument = {
    name: string,
    value: ?ConcreteDirectiveValue,
  };
  declare export type ConcreteDirectiveValue =
    | ConcreteCallValue
    | ConcreteCallVariable
    | Array<ConcreteCallValue | ConcreteCallVariable>;
  declare export type ConcreteField = {
    alias?: ?string,
    calls?: ?Array<ConcreteCall>,
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    fieldName: string,
    kind: 'Field',
    metadata: ConcreteFieldMetadata,
    type: string,
  };
  declare export type ConcreteFieldMetadata = {
    canHaveSubselections?: ?boolean,
    inferredPrimaryKey?: ?string,
    inferredRootCallName?: ?string,
    isAbstract?: boolean,
    isConnection?: boolean,
    isConnectionWithoutNodeID?: boolean,
    isFindable?: boolean,
    isGenerated?: boolean,
    isPlural?: boolean,
    isRequisite?: boolean,
  };
  declare export type ConcreteFragment = {
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    id: string,
    kind: 'Fragment',
    metadata: {
      isAbstract?: boolean,
      isPlural?: boolean, // FB Printer
      isTrackingEnabled?: boolean,
      pattern?: boolean, // from @relay directive
      plural?: boolean, // OSS Printer from `@relay`
      hoistedRootArgs?: Array<string>, // for unmasked fragment
    },
    name: string,
    type: string,
  };
  declare export type ConcreteFragmentMetadata = {
    isAbstract?: boolean,
    pattern?: boolean,
    plural?: boolean,
  };
  declare export type ConcreteMutation = {
    calls: Array<ConcreteCall>,
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    kind: 'Mutation',
    metadata: {
      inputType?: ?string,
    },
    name: string,
    responseType: string,
  };
  declare export type ConcreteNode = {
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
  };
  declare export type ConcreteOperationMetadata = {
    inputType?: ?string,
  };
  declare export type ConcreteQuery = {
    calls?: ?Array<ConcreteCall>,
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    fieldName: string,
    isDeferred?: boolean,
    kind: 'Query',
    metadata: {
      identifyingArgName?: ?string,
      identifyingArgType?: ?string,
      isAbstract?: ?boolean,
      isPlural?: ?boolean,
    },
    name: string,
    type: string,
  };
  declare export type ConcreteQueryMetadata = {
    identifyingArgName: ?string,
    identifyingArgType: ?string,
    isAbstract: ?boolean,
    isDeferred: ?boolean,
    isPlural: ?boolean,
  };
  declare export type ConcreteSelection =
    | ConcreteField
    | ConcreteFragment
    | ConcreteFragmentSpread;
  declare export type ConcreteSubscription = {
    calls: Array<ConcreteCall>,
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    kind: 'Subscription',
    name: string,
    responseType: string,
    metadata: {
      inputType?: ?string,
    },
  };
  declare export type ConcreteValue =
    | ConcreteBatchCallVariable
    | ConcreteCallValue
    | ConcreteCallVariable
    | Array<ConcreteCallValue | ConcreteCallVariable>;

  declare export type ConcreteFragmentSpread = {
    kind: 'FragmentSpread',
    args: VariableMapping,
    fragment: ConcreteFragmentDefinition,
  };

  /**
   * The output of a graphql-tagged fragment definition.
   */
  declare export type ConcreteFragmentDefinition = {
    kind: 'FragmentDefinition',
    argumentDefinitions: Array<ConcreteArgumentDefinition>,
    node: ConcreteFragment,
  };

  declare export type ConcreteArgumentDefinition =
    | ConcreteLocalArgumentDefinition
    | ConcreteRootArgumentDefinition;

  declare export type ConcreteLocalArgumentDefinition = {
    kind: 'LocalArgument',
    name: string,
    defaultValue: mixed,
  };

  declare export type ConcreteRootArgumentDefinition = {
    kind: 'RootArgument',
    name: string,
  };

  /**
   * The output of a graphql-tagged operation definition.
   */
  declare export type ConcreteOperationDefinition = {
    kind: 'OperationDefinition',
    argumentDefinitions: Array<ConcreteLocalArgumentDefinition>,
    name: string,
    operation: 'mutation' | 'query' | 'subscription',
    node: ConcreteFragment | ConcreteMutation | ConcreteSubscription,
  };

  declare export type ConcreteSubscription = {
    calls: Array<ConcreteCall>,
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    kind: 'Subscription',
    name: string,
    responseType: string,
    metadata: {
      inputType?: ?string,
    },
  };

  declare export type ConcreteMutation = {
    calls: Array<ConcreteCall>,
    children?: ?Array<?ConcreteSelection>,
    directives?: ?Array<ConcreteDirective>,
    kind: 'Mutation',
    metadata: {
      inputType?: ?string,
    },
    name: string,
    responseType: string,
  };

  /**
   * The output of a graphql-tagged operation definition.
   */
  declare export type ConcreteOperationDefinition = {
    kind: 'OperationDefinition',
    argumentDefinitions: Array<ConcreteLocalArgumentDefinition>,
    name: string,
    operation: 'mutation' | 'query' | 'subscription',
    node: ConcreteFragment | ConcreteMutation | ConcreteSubscription,
  };

  declare export type RelayConcreteNode = mixed;

  declare export function RelayQL(
    strings: Array<string>,
    ...substitutions: Array<any>
  ): RelayConcreteNode;

  // The type of a graphql`...` tagged template expression.
  declare export type GraphQLTaggedNode =
    | (() => ConcreteFragment | RequestNode)
    | {
        modern: () => ConcreteFragment | RequestNode,
        classic: RelayQL => ConcreteFragmentDefinition | ConcreteOperationDefinition,
      };

  declare export type GeneratedNodeMap = { [key: string]: GraphQLTaggedNode };

  declare export type RelayProp = {|
    environment: IEnvironment,
  |};

  /**
   * A utility type which takes the type of a fragment's data (typically found in
   * a relay generated file) and returns a fragment reference type. This is used
   * when the input to a Relay component needs to be explicitly typed:
   *
   *   // ExampleComponent.js
   *   import type {ExampleComponent_data} from './generated/ExampleComponent_data.graphql';
   *   type Props = {
   *     title: string,
   *     data: ExampleComponent_data,
   *   };
   *
   *   export default createFragmentContainer(
   *     (props: Props) => <div>{props.title}, {props.data.someField}</div>,
   *     graphql`
   *       fragment ExampleComponent_data on SomeType {
   *         someField
   *       }`
   *   );
   *
   *   // ExampleUsage.js
   *   import type {ExampleComponent_data} from './generated/ExampleComponent_data.graphql';
   *   type Props = {
   *     title: string,
   *     data: $FragmentRef<ExampleComponent_data>,
   *   };
   *
   *   export default function ExampleUsage(props: Props) {
   *     return <ExampleComponent {...props} />
   *   }
   *
   */
  declare export type $FragmentRef<T> = {
    +$fragmentRefs: $PropertyType<T, '$refType'>,
  };

  /**
   * A utility type that takes the Props of a component and the type of
   * `props.relay` and returns the props of the container.
   */
  declare export type $RelayProps<Props, RelayPropT> = $ObjMap<
    $Diff<Props, { relay: RelayPropT | void }>,
    (<T: { +$refType: empty }>(T) => T) &
      (<T: { +$refType: empty }>(?T) => ?T) &
      (<TRef: FragmentReference, T: { +$refType: TRef }>(T) => $FragmentRef<T>) &
      (<TRef: FragmentReference, T: { +$refType: TRef }>(?T) => ?$FragmentRef<T>) &
      (<TRef: FragmentReference, T: { +$refType: TRef }>(
        $ReadOnlyArray<T>,
      ) => $ReadOnlyArray<$FragmentRef<T>>) &
      (<TRef: FragmentReference, T: { +$refType: TRef }>(
        ?$ReadOnlyArray<T>,
      ) => ?$ReadOnlyArray<$FragmentRef<T>>) &
      (<TRef: FragmentReference, T: { +$refType: TRef }>(
        $ReadOnlyArray<?T>,
      ) => $ReadOnlyArray<?$FragmentRef<T>>) &
      (<TRef: FragmentReference, T: { +$refType: TRef }>(
        ?$ReadOnlyArray<?T>,
      ) => ?$ReadOnlyArray<?$FragmentRef<T>>) &
      (<T>(T) => T),
  >;

  declare export function createFragmentContainer<
    Props: {},
    TComponent: React$ComponentType<Props>,
  >(
    Component: TComponent,
    fragmentSpec: GraphQLTaggedNode | GeneratedNodeMap,
  ): React$ComponentType<$RelayProps<React$ElementConfig<TComponent>, RelayProp>>;

  /**
   * A Subscription object is returned from .subscribe(), which can be
   * unsubscribed or checked to see if the resulting subscription has closed.
   */
  declare export type Subscription = {|
    +unsubscribe: () => void,
    +closed: boolean,
  |};

  /**
   * An Observer is an object of optional callback functions provided to
   * .subscribe(). Each callback function is invoked when that event occurs.
   */
  declare export type Observer<-T> = {|
    +start?: ?(Subscription) => mixed,
    +next?: ?(T) => mixed,
    +error?: ?(Error) => mixed,
    +complete?: ?() => mixed,
    +unsubscribe?: ?(Subscription) => mixed,
  |};

  declare export type ObserverOrCallback = Observer<void> | ((error: ?Error) => mixed);

  declare export type RefetchOptions = {
    force?: boolean,
    rerunParamExperimental?: RerunParam,
  };

  /**
   * Represents any resource that must be explicitly disposed of. The most common
   * use-case is as a return value for subscriptions, where calling `dispose()`
   * would cancel the subscription.
   */
  declare export type Disposable = {
    dispose(): void,
  };

  declare export type RelayRefetchProp = {
    ...RelayProp,
    refetch: (
      refetchVariables: Variables | ((fragmentVariables: Variables) => Variables),
      renderVariables: ?Variables,
      observerOrCallback: ?ObserverOrCallback,
      options?: RefetchOptions,
    ) => Disposable,
  };

  declare export function createRefetchContainer<Props: {}, TComponent: React$ComponentType<Props>>(
    Component: TComponent,
    fragmentSpec: GraphQLTaggedNode | GeneratedNodeMap,
    taggedNode: GraphQLTaggedNode,
  ): React$ComponentType<$RelayProps<React$ElementConfig<TComponent>, RelayRefetchProp>>;

  /**
   * Runtime function to correspond to the `graphql` tagged template function.
   * All calls to this function should be transformed by the plugin.
   */
  declare export function graphql(strings: Array<string>): GraphQLTaggedNode;

  declare export type QueryRendererProps = {
    cacheConfig?: ?CacheConfig,
    // dataFrom?: DataFrom,
    // environment: IEnvironment | ClassicEnvironment,
    query: ?GraphQLTaggedNode,
    // render: (renderProps: RenderProps) => React.Node,
    variables: Variables,
  };

  declare export type QueryRendererState = {
    // prevPropsEnvironment: IEnvironment | ClassicEnvironment,
    prevPropsVariables: Variables,
    prevQuery: ?GraphQLTaggedNode,
    // queryFetcher: ReactRelayQueryFetcher,
    // relayContextEnvironment: IEnvironment | ClassicEnvironment,
    relayContextVariables: Variables,
    // renderProps: RenderProps,
    // retryCallbacks: RetryCallbacks,
  };

  declare type Environment = any;

  declare export type RangeOperation = 'append' | 'ignore' | 'prepend' | 'refetch' | 'remove';

  declare type RangeBehaviorsFunction = (connectionArgs: {
    [name: string]: $FlowFixMe,
  }) => RangeOperation;
  declare type RangeBehaviorsObject = {
    [key: string]: RangeOperation,
  };
  declare export type RangeBehaviors = RangeBehaviorsFunction | RangeBehaviorsObject;

  declare type RangeAddConfig = {|
    type: 'RANGE_ADD',
    parentName?: string,
    parentID?: string,
    connectionInfo?: Array<{|
      key: string,
      filters?: Variables,
      rangeBehavior: string,
    |}>,
    connectionName?: string,
    edgeName: string,
    rangeBehaviors?: RangeBehaviors,
  |};

  declare type RangeDeleteConfig = {|
    type: 'RANGE_DELETE',
    parentName?: string,
    parentID?: string,
    connectionKeys?: Array<{|
      key: string,
      filters?: Variables,
    |}>,
    connectionName?: string,
    deletedIDFieldName: string | Array<string>,
    pathToConnection: Array<string>,
  |};

  declare type NodeDeleteConfig = {|
    type: 'NODE_DELETE',
    parentName?: string,
    parentID?: string,
    connectionName?: string,
    deletedIDFieldName: string,
  |};

  // Unused in Relay Modern
  declare type LegacyFieldsChangeConfig = {|
    type: 'FIELDS_CHANGE',
    fieldIDs: { [fieldName: string]: DataID | Array<DataID> },
  |};

  // Unused in Relay Modern
  declare type LegacyRequiredChildrenConfig = {|
    type: 'REQUIRED_CHILDREN',
    children: Array<RelayConcreteNode>,
  |};

  declare export type DeclarativeMutationConfig =
    | RangeAddConfig
    | RangeDeleteConfig
    | NodeDeleteConfig
    | LegacyFieldsChangeConfig
    | LegacyRequiredChildrenConfig;

  declare export type PayloadError = {
    message: string,
    locations?: Array<{
      line: number,
      column: number,
    }>,
  };

  declare export type DataID = string;

  /**
   * An interface for imperatively getting/setting properties of a `Record`. This interface
   * is designed to allow the appearance of direct Record manipulation while
   * allowing different implementations that may e.g. create a changeset of
   * the modifications.
   */
  declare export interface RecordProxy {
    copyFieldsFrom(source: RecordProxy): void;
    getDataID(): DataID;
    getLinkedRecord(name: string, args?: ?Variables): ?RecordProxy;
    getLinkedRecords(name: string, args?: ?Variables): ?Array<?RecordProxy>;
    getOrCreateLinkedRecord(name: string, typeName: string, args?: ?Variables): RecordProxy;
    getType(): string;
    getValue(name: string, args?: ?Variables): mixed;
    setLinkedRecord(record: RecordProxy, name: string, args?: ?Variables): RecordProxy;
    setLinkedRecords(records: Array<?RecordProxy>, name: string, args?: ?Variables): RecordProxy;
    setValue(value: mixed, name: string, args?: ?Variables): RecordProxy;
  }

  /**
   * Extends the RecordSourceProxy interface with methods for accessing the root
   * fields of a Selector.
   */
  declare export interface RecordSourceSelectorProxy {
    create(dataID: DataID, typeName: string): RecordProxy;
    delete(dataID: DataID): void;
    get(dataID: DataID): ?RecordProxy;
    getRoot(): RecordProxy;
    getRootField(fieldName: string): ?RecordProxy;
    getPluralRootField(fieldName: string): ?Array<?RecordProxy>;
  }

  /**
   * Similar to StoreUpdater, but accepts a proxy tied to a specific selector in
   * order to easily access the root fields of a query/mutation as well as a
   * second argument of the response object of the mutation.
   */
  declare export type SelectorStoreUpdater = (
    store: RecordSourceSelectorProxy,
    // Actually RelayCombinedEnvironmentTypes#SelectorData, but mixed is
    // inconvenient to access deeply in product code.
    data: $FlowFixMe,
  ) => void;

  declare export type MutationConfig<T> = {|
    configs?: Array<DeclarativeMutationConfig>,
    mutation: GraphQLTaggedNode,
    variables: Variables,
    uploadables?: UploadableMap,
    onCompleted?: ?(response: T, errors: ?Array<PayloadError>) => void,
    onError?: ?(error: Error) => void,
    optimisticUpdater?: ?SelectorStoreUpdater,
    optimisticResponse?: Object,
    updater?: ?SelectorStoreUpdater,
  |};

  declare export function commitMutation<T>(
    environment: Environment,
    config: MutationConfig<T>,
  ): Disposable;
}
