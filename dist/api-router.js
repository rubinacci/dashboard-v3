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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRouter = void 0;
const express_1 = require("express");
const constants_1 = require("./constants");
const coingecko_1 = require("./coingecko");
const bloxy_1 = require("./bloxy");
const StatsProvider_1 = require("./StatsProvider");
const Joi = require('@hapi/joi');
class APIRouter {
    constructor() {
        this.router = express_1.Router();
        this.coingecko = coingecko_1.Coingecko.getInstance();
        this.bloxy = bloxy_1.Bloxy.getInstance();
        // Dummy service called by heroku process scheduler to prevent free dyno from sleeping
        this.router.get("/keepalive", (req, res) => {
            res.sendStatus(200);
        });
        /*
            const customJoi = Joi.extend((joi: any) => {
              return {
                name: 'stringArray',
                base: joi.array().items(joi.string()).meta({ baseType: 'array' }),
                coerce(value: any, helpers: any) {
                  if (typeof value !== 'string') {
                    return { value: value };
                  }
                  if (!value) {
                    return [];
                  }
                  return value.replace(/^,+|,+$/mg, '').split(',');
                }
              };
            });
        
            const schema = Joi.object().keys({
              coins: customJoi.stringArray().items(Joi.string())
            });
        */
        this.router.get("/chartdata", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.json(yield StatsProvider_1.StatsProvider.fetchChartData());
            }
            catch (e) {
                console.error(e);
                res.status(500).send(e.toString());
            }
        }));
        this.router.get("/statera/top_holders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const r = yield this.bloxy.getHolders(constants_1.Contracts.statera);
            res.json(r);
        }));
        this.router.get("/delta/top_holders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const r = yield this.bloxy.getHolders(constants_1.Contracts.delta);
            res.json(r);
        }));
        this.router.get("/bpt/top_holders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const r = yield this.bloxy.getHolders(constants_1.Contracts.bpt);
            res.json(r);
        }));
        this.router.get("/stats", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.json(yield StatsProvider_1.StatsProvider.fetchStats());
            }
            catch (e) {
                console.error(e);
                res.status(500).send(e.toString());
            }
            /*res.json({
              topData: {
                statera: {
                  shares: "0.03%",
                  staxeth: "200",
                  sta: "9832190831.233",
                  apy: {
                    "24hr": "88.99%",
                    "1w": "18%",
                    "1m": "18.3%",
                    "1y": "18.3%"
                  }
                },
                delta: {
                  shares: "0.03%",
                  staxeth: "200",
                  sta: "9832190831.233",
                  apy: {
                    "24hr": "88.99%",
                    "1w": "18%",
                    "1m": "18.3%",
                    "1y": "18.3%"
                  }
                },
                phoenix: {
                  shares: "0.03%",
                  staxeth: "200",
                  sta: "9832190831.233",
                  apy: {
                    "24hr": "88.99%",
                    "1w": "18%",
                    "1m": "18.3%",
                    "1y": "18.3%"
                  }
                },
                all: {
                  shares: "0.03%",
                  staxeth: "200",
                  sta: "9832190831.233",
                  apy: {
                    "24hr": "88.99%",
                    "1w": "18%",
                    "1m": "18.3%",
                    "1y": "18.3%"
                  }
                }
              }
            });*/
        }));
    }
}
exports.APIRouter = APIRouter;
//# sourceMappingURL=api-router.js.map