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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
const config_1 = require("../../../config");
const getDistributionForBucket_1 = require("./getDistributionForBucket");
const cloudfront = new AWS.CloudFront(config_1.config.AWS_SERVICE_CONFIG);
exports.createCacheInvalidation = ({ DistributionId, Bucket }) => __awaiter(void 0, void 0, void 0, function* () {
    const invalidate = (id) => cloudfront
        .createInvalidation({
        DistributionId: id,
        InvalidationBatch: {
            CallerReference: `${Date.now()}`,
            Paths: {
                Quantity: 1,
                Items: ["/*"]
            }
        }
    })
        .promise();
    const id = DistributionId ? DistributionId : yield getDistributionForBucket_1.getDistributionForBucket({ Bucket });
    if (!id) {
        throw new Error("must provide wither Bucekt with an assoicated distribution or DistributionID to create an invalidation");
    }
    console.log(`attempting to invalidate DistributionId: ${id}`);
    return yield invalidate(id);
});
