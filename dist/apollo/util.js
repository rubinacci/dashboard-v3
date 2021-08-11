"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentLiquidity = exports.getTokenAPY = exports.getTokenVolumeHistory = exports.getTokenPriceHistory = exports.getBlockIntervalFromStartTime = exports.getBlocksFromTimestamps = exports.splitQuery = void 0;
const client_1 = require("./client");
const graphql_queries_1 = require("./graphql_queries");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const cache_1 = require("../cache");
const util_1 = require("../util");
dayjs_1.default.extend(utc_1.default);
function splitQuery(query, localClient, vars, list, skipCount = 100) {
    return __awaiter(this, void 0, void 0, function* () {
        let fetchedData = {};
        let allFound = false;
        let skip = 0;
        while (!allFound) {
            let end = list.length;
            if (skip + skipCount < list.length) {
                end = skip + skipCount;
            }
            let sliced = list.slice(skip, end);
            let result = sliced.length > 0 ? yield localClient.query({
                query: query(...vars, sliced),
                fetchPolicy: 'cache-first',
            }) : { data: {} };
            fetchedData = Object.assign(Object.assign({}, fetchedData), result.data);
            if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
                allFound = true;
            }
            else {
                skip += skipCount;
            }
        }
        return fetchedData;
    });
}
exports.splitQuery = splitQuery;
function getBlocksFromTimestamps(timestamps, skipCount = 500) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((timestamps === null || timestamps === void 0 ? void 0 : timestamps.length) === 0) {
            return [];
        }
        let fetchedData = yield splitQuery(graphql_queries_1.GET_BLOCKS, client_1.blockClient, [], timestamps, skipCount);
        let blocks = [];
        if (fetchedData) {
            for (var t in fetchedData) {
                if (fetchedData[t].length > 0) {
                    blocks.push({
                        timestamp: t.split('t')[1],
                        number: fetchedData[t][0]['number'],
                    });
                }
            }
        }
        return blocks;
    });
}
exports.getBlocksFromTimestamps = getBlocksFromTimestamps;
const getBlockIntervalFromStartTime = (startTime, interval) => __awaiter(void 0, void 0, void 0, function* () {
    const utcEndTime = dayjs_1.default.utc();
    let time = startTime;
    // create an array of hour start times until we reach current hour
    // buffer by half hour to catch case where graph isnt synced to latest block
    const timestamps = [];
    while (time < utcEndTime.unix() - 30 * 60) {
        timestamps.push(time);
        time += interval;
    }
    // backout if invalid timestamp format
    if (timestamps.length === 0) {
        return [];
    }
    return yield getBlocksFromTimestamps(timestamps);
});
exports.getBlockIntervalFromStartTime = getBlockIntervalFromStartTime;
const getTokenPriceHistory = (address, startTime, interval, source) => __awaiter(void 0, void 0, void 0, function* () {
    const blocks = yield cache_1.Cache.getInstance().cachedValueOrClosureAsync(`BLOCKS_FROM_TIMESTAMP_${startTime}_${interval}`, () => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getBlockIntervalFromStartTime(startTime, interval); }), parseInt(process.env.CACHE_TTL));
    switch (source) {
        case "uniswap": {
            const result = yield splitQuery(graphql_queries_1.UNISWAP_PRICES_BY_BLOCK, client_1.uniswapClient, [address], blocks, 50);
            const values = Object.keys(result).filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map(timestamp => {
                const derivedETH = parseFloat(result[`t${timestamp}`].derivedETH);
                const ethPrice = result[`b${timestamp}`].ethPrice;
                const priceUSD = derivedETH * ethPrice;
                return [parseInt(timestamp), priceUSD];
            });
            return values;
        }
        case "balancer": {
            const result = yield splitQuery(graphql_queries_1.BALANCER_PRICES_BY_BLOCK, client_1.balancerClient, [address], blocks, 50);
            const values = Object.keys(result).filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map(timestamp => {
                const liquidity = parseFloat(result[`t${timestamp}`].liquidity);
                const totalShares = parseFloat(result[`t${timestamp}`].totalShares);
                const priceUSD = liquidity / totalShares;
                return [parseInt(timestamp), priceUSD];
            });
            return values;
        }
    }
});
exports.getTokenPriceHistory = getTokenPriceHistory;
const getTokenVolumeHistory = (pairAddress, startTime, interval, source) => __awaiter(void 0, void 0, void 0, function* () {
    switch (source) {
        case "uniswap": {
            let data = [];
            const utcEndTime = dayjs_1.default.utc();
            startTime = util_1.getTimeframeOptions("all")[0];
            try {
                let allFound = false;
                let skip = 0;
                while (!allFound) {
                    let result = yield client_1.uniswapClient.query({
                        query: graphql_queries_1.UNISWAP_PAIR_CHART,
                        variables: {
                            pairAddress: pairAddress,
                            skip,
                        },
                        fetchPolicy: 'cache-first',
                    });
                    skip += 1000;
                    data = data.concat(result.data.pairDayDatas);
                    if (result.data.pairDayDatas.length < 1000) {
                        allFound = true;
                    }
                }
                let dayIndexSet = new Set();
                let dayIndexArray = [];
                const oneDay = 24 * 60 * 60;
                data.forEach((dayData, i) => {
                    // add the day index to the set of days
                    dayIndexSet.add((data[i].date / oneDay).toFixed(0));
                    dayIndexArray.push(data[i]);
                    dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD);
                    dayData.reserveUSD = parseFloat(dayData.reserveUSD);
                });
                if (data[0]) {
                    // fill in empty days
                    let timestamp = data[0].date ? data[0].date : startTime;
                    let latestLiquidityUSD = data[0].reserveUSD;
                    let index = 1;
                    while (timestamp < utcEndTime.unix() - oneDay) {
                        const nextDay = timestamp + oneDay;
                        let currentDayIndex = (nextDay / oneDay).toFixed(0);
                        if (!dayIndexSet.has(currentDayIndex)) {
                            data.push({
                                date: nextDay,
                                dayString: nextDay,
                                dailyVolumeUSD: 0,
                                reserveUSD: latestLiquidityUSD,
                            });
                        }
                        else {
                            latestLiquidityUSD = dayIndexArray[index].reserveUSD;
                            index = index + 1;
                        }
                        timestamp = nextDay;
                    }
                }
                data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1));
            }
            catch (e) {
                console.log(e);
            }
            return data.map(({ date, dailyVolumeUSD }) => [date, dailyVolumeUSD]);
        }
        case "balancer": {
            interval = 3600 * 24;
            const blocks = yield cache_1.Cache.getInstance().cachedValueOrClosureAsync(`BLOCKS_FROM_TIMESTAMP_${startTime}_${interval}`, () => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getBlockIntervalFromStartTime(startTime, interval); }), parseInt(process.env.CACHE_TTL));
            const result = yield splitQuery(graphql_queries_1.BALANCER_DAILY_VOLUME, client_1.balancerClient, [pairAddress], blocks, 50);
            const queryLabels = Object.keys(result).filter(r => !!result[r]);
            const getTotalSwapVolume = (t) => { try {
                return result[t].totalSwapVolume;
            }
            catch (_a) {
                return 0;
            } };
            const volumes = queryLabels.map(r => r.split("t")[1]).filter(r => !!r).map((timestamp, i) => {
                const totalSwapVolume = parseFloat(getTotalSwapVolume(`t${timestamp}`));
                const deltaVolume = totalSwapVolume - (i === 0 ? 0 : parseFloat(getTotalSwapVolume(queryLabels[i - 1])));
                return [parseInt(timestamp), deltaVolume];
            });
            return volumes;
        }
    }
});
exports.getTokenVolumeHistory = getTokenVolumeHistory;
const getTokenAPY = (address, startTime, interval, days, source) => __awaiter(void 0, void 0, void 0, function* () {
    switch (source) {
        case "uniswap": {
            const result = yield client_1.uniswapClient.query({
                query: graphql_queries_1.UNISWAP_TOKEN_DAILY_DATA(address, days),
                fetchPolicy: 'cache-first',
            });
            const periodRoi = result.data.tokenDayDatas.map(dayData => {
                const UNISWAP_FEES = 0.3 / 100;
                const fees = UNISWAP_FEES * dayData.dailyVolumeUSD;
                const roi = fees / dayData.totalLiquidityUSD;
                return roi;
            }).reduce((a, b) => a + b, 0);
            const yearlyRoi = periodRoi * 365 / days * 100;
            return yearlyRoi;
        }
        case "balancer": {
            const blocks = yield cache_1.Cache.getInstance().cachedValueOrClosureAsync(`BLOCKS_FROM_TIMESTAMP_${startTime}_${interval}`, () => __awaiter(void 0, void 0, void 0, function* () { return yield exports.getBlockIntervalFromStartTime(startTime, interval); }), parseInt(process.env.CACHE_TTL));
            const result = yield splitQuery(graphql_queries_1.BALANCER_DAILY_SWAP_FEE, client_1.balancerClient, [address], blocks, 50);
            const queryLabels = Object.keys(result);
            const periodRoi = queryLabels.filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map((timestamp, i) => {
                const liquidity = parseFloat(result[`t${timestamp}`].liquidity);
                const totalSwapFee = parseFloat(result[`t${timestamp}`].totalSwapFee);
                const deltaSwapFee = totalSwapFee - (i === 0 ? 0 : parseFloat(result[queryLabels[i - 1]].totalSwapFee));
                const roi = deltaSwapFee / liquidity;
                return roi;
            }).reduce((a, b) => a + b, 0);
            const yearlyRoi = periodRoi * 365 / days;
            return yearlyRoi;
        }
    }
});
exports.getTokenAPY = getTokenAPY;
const getCurrentLiquidity = (address, source) => __awaiter(void 0, void 0, void 0, function* () {
    switch (source) {
        case "uniswap": {
            const result = yield client_1.uniswapClient.query({
                query: graphql_queries_1.UNISWAP_LIQUIDITY(address),
                fetchPolicy: "cache-first"
            });
            return result.data.pair.reserveUSD;
        }
        case "balancer": {
            const result = yield client_1.balancerClient.query({
                query: graphql_queries_1.BALANCER_LIQUIDITY(address),
                fetchPolicy: "cache-first"
            });
            return result.data.pool.liquidity;
        }
    }
});
exports.getCurrentLiquidity = getCurrentLiquidity;
//# sourceMappingURL=util.js.map