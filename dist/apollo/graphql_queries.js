"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BALANCER_PRICES_BY_BLOCK = exports.BALANCER_DAILY_SWAP_FEE = exports.BALANCER_DAILY_VOLUME = exports.BALANCER_LIQUIDITY = exports.UNISWAP_LIQUIDITY = exports.UNISWAP_TOKEN_DAILY_DATA = exports.UNISWAP_PAIR_CHART = exports.UNISWAP_PRICES_BY_BLOCK = exports.GET_BLOCKS = exports.GET_BLOCK = exports.SUBGRAPH_HEALTH = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.SUBGRAPH_HEALTH = graphql_tag_1.default `
    query health {
        indexingStatusForCurrentVersion(subgraphName: "uniswap/uniswap-v2") {
            synced
            health
            chains {
                chainHeadBlock {
                    number
                }
                latestBlock {
                    number
                }
            }
        }
    }
`;
exports.GET_BLOCK = graphql_tag_1.default `
    query blocks($timestampFrom: Int!, $timestampTo: Int!) {
        blocks(
            first: 1
            orderBy: timestamp
            orderDirection: asc
            where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
        ) {
            id
            number
            timestamp
        }
    }
`;
const GET_BLOCKS = (timestamps) => {
    let queryString = 'query blocks {';
    queryString += timestamps.map((timestamp) => {
        return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
            number
        }`;
    });
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.GET_BLOCKS = GET_BLOCKS;
const UNISWAP_PRICES_BY_BLOCK = (tokenAddress, blocks) => {
    let queryString = 'query blocks {';
    queryString += blocks.map((block) => `
            t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
            derivedETH
            }
        `);
    queryString += ',';
    queryString += blocks.map((block) => `
            b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) { 
            ethPrice
            }
        `);
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.UNISWAP_PRICES_BY_BLOCK = UNISWAP_PRICES_BY_BLOCK;
exports.UNISWAP_PAIR_CHART = graphql_tag_1.default `
  query pairDayDatas($pairAddress: Bytes!, $skip: Int!) {
    pairDayDatas(first: 1000, skip: $skip, orderBy: date, orderDirection: asc, where: { pairAddress: $pairAddress }) {
      id
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      reserveUSD
    }
  }
`;
const UNISWAP_TOKEN_DAILY_DATA = (address, days) => graphql_tag_1.default `
    query tokenDayDatas {
        tokenDayDatas(where: { token: "${address}" }, orderBy: date, orderDirection: desc, first: ${days}) {
            id
            date
            dailyVolumeUSD
            totalLiquidityUSD
        }
    }
`;
exports.UNISWAP_TOKEN_DAILY_DATA = UNISWAP_TOKEN_DAILY_DATA;
const UNISWAP_LIQUIDITY = (address) => graphql_tag_1.default `
    query pair {
        pair(id: "${address}") {
            reserveUSD
        }
    }
`;
exports.UNISWAP_LIQUIDITY = UNISWAP_LIQUIDITY;
const BALANCER_LIQUIDITY = (address) => graphql_tag_1.default `
    query pool {
        pool(id: "${address}") {
            liquidity
        }
    }
`;
exports.BALANCER_LIQUIDITY = BALANCER_LIQUIDITY;
const BALANCER_DAILY_VOLUME = (poolAddress, blocks) => {
    let queryString = 'query dailyData {';
    queryString += blocks.map((block) => `
            t${block.timestamp}:pool(id:"${poolAddress}", block: { number: ${block.number} }) {
                liquidity
                totalSwapVolume
            }
        `);
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.BALANCER_DAILY_VOLUME = BALANCER_DAILY_VOLUME;
const BALANCER_DAILY_SWAP_FEE = (poolAddress, blocks) => {
    let queryString = 'query dailyData {';
    queryString += blocks.map((block) => `
            t${block.timestamp}:pool(id:"${poolAddress}", block: { number: ${block.number} }) {
                liquidity
                totalSwapFee
            }
        `);
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.BALANCER_DAILY_SWAP_FEE = BALANCER_DAILY_SWAP_FEE;
const BALANCER_PRICES_BY_BLOCK = (poolAddress, blocks) => {
    let queryString = 'query blocks {';
    queryString += blocks.map((block) => `
            t${block.timestamp}:pool(id:"${poolAddress}", block: { number: ${block.number} }) { 
                liquidity
                totalShares
            }
        `);
    queryString += '}';
    return graphql_tag_1.default(queryString);
};
exports.BALANCER_PRICES_BY_BLOCK = BALANCER_PRICES_BY_BLOCK;
//# sourceMappingURL=graphql_queries.js.map