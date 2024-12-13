"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Address', required: true },
    foodItems: [
        {
            foodItem: { type: mongoose_1.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
            quantity: { type: Number, required: true },
            restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String, },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'placed' },
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Order = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = Order;
