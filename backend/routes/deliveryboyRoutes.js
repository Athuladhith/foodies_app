"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliveryController_1 = require("../controller/deliveryController");
const router = express_1.default.Router();
router.post('/deliveryboylogin', deliveryController_1.deliveryboylogin);
router.get('/deliveryorder/:id', deliveryController_1.deliveryOrders);
router.post('/orderupdates/:id', deliveryController_1.makeorderupdates);
router.post('/orderupdatess/:id', deliveryController_1.makeorderupdatess);
exports.default = router;
