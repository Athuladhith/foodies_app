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
exports.getTopRestaurants = exports.getTotalRevenue = exports.getTotalOrders = exports.getTotalRestaurants = exports.getTotalUsers = exports.addCategory = exports.blockUnblockUser = exports.getUsers = exports.adminlogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const adminlogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        console.log('Admin login attempt with email:', email);
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            console.log('Admin login failed: Email not registered');
            res.status(400).json({ message: 'Email not registered' });
            return;
        }
        if (user.password && (yield bcryptjs_1.default.compare(password, user.password))) {
            console.log('Password matched for user:', user.email);
            if (user.isAdmin === true) {
                console.log('User is admin:', user.email);
                const token = jsonwebtoken_1.default.sign({ userId: user._id.toHexString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log('Admin login successful. Generating token.');
                res.status(200).json({
                    message: 'Admin login successful',
                    admin: {
                        id: user._id.toHexString(),
                        email: user.email,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        avatar: user.avatar,
                        isAdmin: user.isAdmin,
                    },
                    token,
                });
            }
            else {
                console.log('Login failed: User is not an admin');
                res.status(403).json({ message: 'User is not an admin' });
            }
        }
        else {
            console.log('Login failed: Wrong password for user:', email);
            res.status(400).json({ message: 'Wrong password' });
        }
    }
    catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.adminlogin = adminlogin;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({});
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
exports.getUsers = getUsers;
const blockUnblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(1001);
        const { id } = req.params;
        const { isBlocked } = req.body;
        console.log(id, "idddddddddd");
        console.log(isBlocked, "isblocked");
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.isBlocked = isBlocked;
        yield user.save();
        res.status(200).json({ message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the user status' });
    }
});
exports.blockUnblockUser = blockUnblockUser;
exports.addCategory = [
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description } = req.body;
        const avatar = req.file;
        try {
            const categoryExists = yield categoryModel_1.default.findOne({ name });
            if (categoryExists) {
                res.status(400).json({ message: 'Restaurant already exists' });
                return;
            }
            const newCategory = new categoryModel_1.default({
                name,
                description,
                avatar: avatar ? avatar.buffer.toString('base64') : 'No avatar provided',
            });
            yield newCategory.save();
            res.status(201).json({
                message: 'Restaurant registered successfully.',
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Registration failed, please try again.' });
        }
    }),
];
////////////////////////////////////////////////////////////
const getTotalUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield userModel_1.default.countDocuments();
        res.status(200).json({ totalUsers });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch total users',
            error: error.message
        });
    }
});
exports.getTotalUsers = getTotalUsers;
const getTotalRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRestaurants = yield restaurantModel_1.default.countDocuments();
        res.status(200).json({ totalRestaurants });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch total restaurants',
            error: error.message
        });
    }
});
exports.getTotalRestaurants = getTotalRestaurants;
const getTotalOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield orderModel_1.default.countDocuments();
        res.status(200).json({ totalOrders });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch total orders',
            error: error.message
        });
    }
});
exports.getTotalOrders = getTotalOrders;
const getTotalRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalRevenue = yield orderModel_1.default.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]);
        res.status(200).json({ totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0 });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch total revenue', error: error.message });
    }
});
exports.getTotalRevenue = getTotalRevenue;
const getTopRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('entered to the top restaurant');
        const topRestaurants = yield orderModel_1.default.aggregate([
            { $unwind: '$foodItems' },
            {
                $group: {
                    _id: '$foodItems.restaurant',
                    totalOrders: { $sum: 1 },
                },
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'restaurantDetails',
                },
            },
            { $unwind: '$restaurantDetails' },
            {
                $project: {
                    _id: 0,
                    restaurantId: '$_id',
                    restaurantName: '$restaurantDetails.restaurantName',
                    ownerName: '$restaurantDetails.ownerName',
                    email: '$restaurantDetails.email',
                    phoneNumber: '$restaurantDetails.phoneNumber',
                    address: '$restaurantDetails.address',
                    avatar: '$restaurantDetails.avatar',
                    totalOrders: 1,
                },
            },
        ]);
        console.log(topRestaurants, 'top restaurant from backkkkkkkk');
        res.status(200).json({ restaurants: topRestaurants });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch top restaurants',
            error: error.message,
        });
    }
});
exports.getTopRestaurants = getTopRestaurants;
