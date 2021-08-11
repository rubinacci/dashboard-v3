"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static logEnabled(category) {
        return process.env["LOG_" + category] === 'true';
    }
    static log(category, logString) {
        if (this.logEnabled(category)) {
            console.log(`[${category}]::${logString}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map