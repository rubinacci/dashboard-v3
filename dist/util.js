"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeframeOptionsDays = exports.getTimeframeInterval = exports.getTimeframeOptions = void 0;
const getTimeframeOptions = (timeframe) => {
    const N_DATA_POINTS = 50;
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = (() => {
        switch (timeframe) {
            case "24h":
            case "1w":
            case "30d":
                return endTime - exports.getTimeframeInterval(timeframe);
            case "all": return 1594771200; // 15 Jul 2020
        }
    })();
    return [startTime, Math.floor((endTime - startTime) / N_DATA_POINTS)];
};
exports.getTimeframeOptions = getTimeframeOptions;
const getTimeframeInterval = (timeframe) => {
    switch (timeframe) {
        case "24h": return 60 * 60 * 24;
        case "1w": return 60 * 60 * 24 * 7;
        case "30d": return 60 * 60 * 24 * 30;
    }
};
exports.getTimeframeInterval = getTimeframeInterval;
const getTimeframeOptionsDays = (timeframe) => {
    switch (timeframe) {
        case "24h": return 1;
        case "1w": return 7;
        case "30d": return 30;
    }
};
exports.getTimeframeOptionsDays = getTimeframeOptionsDays;
//# sourceMappingURL=util.js.map