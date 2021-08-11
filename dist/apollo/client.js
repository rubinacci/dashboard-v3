"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockClient = exports.healthClient = exports.balancerClient = exports.uniswapClient = void 0;
const apollo_client_1 = require("apollo-client");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.uniswapClient = new apollo_client_1.ApolloClient({
    link: new apollo_link_http_1.HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        fetch: node_fetch_1.default
    }),
    cache: new apollo_cache_inmemory_1.InMemoryCache()
});
exports.balancerClient = new apollo_client_1.ApolloClient({
    link: new apollo_link_http_1.HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
        fetch: node_fetch_1.default
    }),
    cache: new apollo_cache_inmemory_1.InMemoryCache()
});
exports.healthClient = new apollo_client_1.ApolloClient({
    link: new apollo_link_http_1.HttpLink({
        uri: 'https://api.thegraph.com/index-node/graphql',
        fetch: node_fetch_1.default
    }),
    cache: new apollo_cache_inmemory_1.InMemoryCache()
});
exports.blockClient = new apollo_client_1.ApolloClient({
    link: new apollo_link_http_1.HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
        fetch: node_fetch_1.default
    }),
    cache: new apollo_cache_inmemory_1.InMemoryCache()
});
//# sourceMappingURL=client.js.map