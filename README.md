# Relay Modern Network Deep Dive

This repo provides incrementally more powerfull implementations to use in Relay Modern Network
Read the Blog post about it: https://medium.com/@sibelius/relay-modern-network-deep-dive-ec187629dfd3

# Simple
Simple network fetch function that send a request (query, mutation) to a GraphQL server
and return a GraphQL Response to fullfill Relay Environment

# With Uploadables
Network that also handle send uploadables (files) to graphql server using FormData

# With Cache
Using RelayQueryResponseCache to enable cache of queries with a predetermined TTL

# Observables
Let you resolve more than one request at once, necessary for
GraphQL Live Queries (Polling) (https://github.com/facebook/relay/issues/2174) and
Deferrable Queries (https://github.com/facebook/relay/issues/2194)

# Deferrable Queries
Built on top of observables network, it will resolve send one query to a GraphQL server per time,
managing dependencies among queries (https://github.com/facebook/relay/issues/2194)
