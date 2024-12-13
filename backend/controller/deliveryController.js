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
exports.makeorderupdatess = exports.makeorderupdates = exports.deliveryboylogin = exports.deliveryOrders = exports.blockUnblockDeliveryboy = exports.getDeliveryPersons = exports.registerDeliveryPerson = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = __importDefault(require("multer"));
const deliveryModel_1 = __importDefault(require("../models/deliveryModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.registerDeliveryPerson = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, phoneNumber, address, password, avatar } = req.body;
        try {
            const deliveryPersonExists = yield deliveryModel_1.default.findOne({ email });
            if (deliveryPersonExists) {
                res.status(400).json({ message: 'Delivery person already exists' });
                return;
            }
            const newDeliveryPerson = new deliveryModel_1.default({
                name,
                email,
                phoneNumber,
                address,
                password: yield bcryptjs_1.default.hash(password, 10),
                avatar
            });
            yield newDeliveryPerson.save();
            res.status(201).json({
                message: 'Delivery person registered successfully.',
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Registration failed, please try again.' });
        }
    }),
];
const getDeliveryPersons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryPersons = yield deliveryModel_1.default.find({});
        res.json(deliveryPersons);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch delivery persons' });
    }
});
exports.getDeliveryPersons = getDeliveryPersons;
const blockUnblockDeliveryboy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(1001);
        const { id } = req.params;
        const { isBlocked } = req.body;
        const deliveryboy = yield deliveryModel_1.default.findById(id);
        if (!deliveryboy) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        deliveryboy.isBlocked = isBlocked;
        yield deliveryboy.save();
        res.status(200).json({ message: `User has been ${deliveryboy.isBlocked ? 'blocked' : 'unblocked'}` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the user status' });
    }
});
exports.blockUnblockDeliveryboy = blockUnblockDeliveryboy;
const deliveryOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id, 'id from the frontend');
        const deliveryOrder = yield orderModel_1.default.findById(id);
        if (!deliveryOrder) {
            res.status(404).json({ message: 'No orders found' });
            return;
        }
        res.status(200).json({ message: 'Order fetch success', data: deliveryOrder });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the order' });
    }
});
exports.deliveryOrders = deliveryOrders;
const deliveryboylogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        console.log('Received login request:', { email, password });
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const deliveryperson = yield deliveryModel_1.default.findOne({ email });
        if (!deliveryperson) {
            console.log('Email not registered');
            res.status(400).json({ message: 'Email not registered' });
            return;
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, deliveryperson.password || '');
        if (!passwordMatch) {
            console.log('Password does not match');
            res.status(400).json({ message: 'Wrong password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            deliveryboyid: deliveryperson._id,
            email: deliveryperson.email,
        }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({
            message: 'Login successful',
            deliveryboyid: deliveryperson._id,
            deliveryperson: {
                id: deliveryperson._id,
                name: deliveryperson.name,
                email: deliveryperson.email,
                phoneNumber: deliveryperson.phoneNumber,
                address: deliveryperson.address,
                avatar: deliveryperson.avatar,
                isBlocked: deliveryperson.isBlocked,
                isVerified: deliveryperson.isVerified,
            },
            token,
        });
    }
    catch (error) {
        console.error('Error during delivery boy login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deliveryboylogin = deliveryboylogin;
const makeorderupdates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Order ID received:", req.params.id);
        const orderId = req.params.id;
        const { id } = req.params;
        const updatedOrder = yield orderModel_1.default.findByIdAndUpdate(id, { orderStatus: 'OUT FOR DELIVERY' }, { new: true });
        if (!updatedOrder) {
            console.error("Order not found:", orderId);
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({
            message: 'Order status updated to FOOD PREPARING',
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.makeorderupdates = makeorderupdates;
const makeorderupdatess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const { id } = req.params;
        const updatedOrder = yield orderModel_1.default.findByIdAndUpdate(id, { orderStatus: 'DELIVERY COMPLETED', paymentStatus: 'paid' }, { new: true });
        if (!updatedOrder) {
            console.error("Order not found:", orderId);
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({
            message: 'Order status updated to FOOD PREPARING',
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.makeorderupdatess = makeorderupdatess;
