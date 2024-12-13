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
exports.getMessages = exports.getMessagesByConversation = exports.sendMessage = exports.getConversationsByUser = exports.createConversation = exports.getRestaurantss = exports.getOrderdetails = exports.makeorderupdate = exports.getOrdersByUserId = exports.getFoodItemByIddd = exports.getOrderDetailss = exports.saveOrder = exports.createOrder = exports.addAddress = exports.getAddresses = exports.updateCartItem = exports.clearCart = exports.removeCartItem = exports.getFoodItemById = exports.getCartItemsByUserId = exports.addToCart = exports.updateProfile = exports.getFoodItemsByRestaurant = exports.getRestaurantById = exports.getFoodItemsByCategory = exports.verifyOtp = exports.login = exports.googleregister = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = __importDefault(require("multer"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailServices_1 = require("../services/emailServices");
const fooditemModel_1 = __importDefault(require("../models/fooditemModel"));
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const addressModel_1 = __importDefault(require("../models/addressModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const razorpay_1 = __importDefault(require("razorpay"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
let registrationData;
let storedOtp;
exports.registerUser = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password, phoneNumber, avatar } = req.body;
        try {
            console.log('1');
            const userExists = yield userModel_1.default.findOne({ email });
            console.log('2');
            if (userExists) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
            console.log('3');
            registrationData = {
                name,
                email,
                phoneNumber,
                password,
                avatar,
            };
            const otp = generateOTP();
            storedOtp = otp;
            yield (0, emailServices_1.sendEmail)(email, 'Your OTP for Registration', ` Your OTP for registration is ${otp}. It will expire in 10 minutes.`);
            res.status(201).json({
                message: 'User registered. Please verify your OTP sent to your email.',
            });
        }
        catch (error) {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }),
];
exports.googleregister = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email } = req.body;
        try {
            const userExists = yield userModel_1.default.findOne({ email });
            if (userExists) {
                res.status(200).json({
                    message: 'Login successful',
                    userId: userExists._id.toHexString(),
                });
            }
            else {
                res.status(400).json({ message: 'Email not registered' });
            }
        }
        catch (error) {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }),
];
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Email not registered' });
            return;
        }
        if (user.isBlocked) {
            res.status(403).json({ message: 'User is blocked' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
            },
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.login = login;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receivedOtp } = req.body;
    console.log(receivedOtp, "recived otp");
    console.log(storedOtp, "stord otp");
    try {
        if (receivedOtp === storedOtp) {
            const hashedPassword = yield bcryptjs_1.default.hash(registrationData.password, 10);
            const user = yield userModel_1.default.create(Object.assign(Object.assign({}, registrationData), { password: hashedPassword, isAdmin: false, isBlocked: false, isVerified: true }));
            res.status(201).json({
                message: 'User registered successfully',
                userId: user._id.toHexString(),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.verifyOtp = verifyOtp;
const getFoodItemsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        console.log(category, 'category');
        if (!category) {
            res.status(400).json({ message: 'Category ID is required' });
            return;
        }
        const foodItem = yield fooditemModel_1.default.find({ category });
        console.log(foodItem, 'fooditem');
        res.status(200).json(foodItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch food items' });
    }
});
exports.getFoodItemsByCategory = getFoodItemsByCategory;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant = yield restaurantModel_1.default.findById(req.params.id);
        if (!restaurant)
            return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getRestaurantById = getRestaurantById;
const getFoodItemsByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurant } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const foodItems = yield fooditemModel_1.default.find({ restaurant })
            .skip(skip)
            .limit(limit);
        const totalItems = yield fooditemModel_1.default.countDocuments({ restaurant });
        res.json({
            foodItems,
            pagination: {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                limit,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getFoodItemsByRestaurant = getFoodItemsByRestaurant;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, email, phoneNumber, avatar } = req.body;
    console.log(req.body, 'boooddddyyyyyy');
    try {
        if (!id) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, { name, email, phoneNumber, avatar }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateProfile = updateProfile;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('helloo');
    try {
        const { foodItemId, userId, quantity } = req.body;
        console.log(foodItemId, userId, quantity, 'bbbbbbbbbbbbboooooooooooth');
        const foodItem = yield fooditemModel_1.default.findById(foodItemId);
        console.log('fooodddd');
        if (!foodItem) {
            res.status(404).json({ message: 'Food item not found' });
            return;
        }
        let cart = yield cartModel_1.default.findOne({ user: userId });
        console.log('carrtttt');
        if (!cart) {
            cart = new cartModel_1.default({
                user: userId,
                items: [],
                totalPrice: 0,
            });
        }
        const itemIndex = cart.items.findIndex(item => item.foodItem.toString() === foodItemId._id.toString());
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price = foodItem.price;
        }
        else {
            const newItem = {
                foodItem: foodItem,
                quantity,
                price: foodItem.price,
            };
            cart.items.push(newItem);
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the item to the cart' });
    }
});
exports.addToCart = addToCart;
const getCartItemsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const cart = yield cartModel_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.json({ items: cart.items });
    }
    catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCartItemsByUserId = getCartItemsByUserId;
const getFoodItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fooditemId = req.query.foodItemId;
    const restaurantId = req.query.restaurant;
    const { id } = req.params;
    console.log(fooditemId, 'fooooditemidddd');
    console.log(restaurantId, 'restaurant id');
    try {
        if (!fooditemId) {
            return res.status(400).json({ message: 'Food item ID is required' });
        }
        const foodItem = yield fooditemModel_1.default.findById(fooditemId);
        console.log(foodItem, 'foooooooooooggggggggggggggg');
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        return res.json(foodItem);
    }
    catch (error) {
        console.error('Error fetching food item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getFoodItemById = getFoodItemById;
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const itemId = req.query.itemId;
    console.log('entered');
    console.log(userId, 'userid');
    try {
        const cart = yield cartModel_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter((item) => item.foodItem.toString() !== itemId);
        yield cart.save();
        return res.status(200).json({ message: 'Item removed from cart', cart });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.removeCartItem = removeCartItem;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        const cart = yield cartModel_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        yield cart.save();
        return res.status(200).json({ message: 'Cart cleared', cart });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.clearCart = clearCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, foodItemId, newQuantity } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(foodItemId)) {
        return res.status(400).json({ message: 'Invalid user or food item ID' });
    }
    try {
        const foodItem = yield fooditemModel_1.default.findById(foodItemId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        if (newQuantity > foodItem.quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }
        const cart = yield cartModel_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItem = cart.items.find(item => item.foodItem.toString() === foodItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Food item not found in cart' });
        }
        const previousQuantity = cartItem.quantity;
        const quantityDifference = newQuantity - previousQuantity;
        cartItem.quantity = newQuantity;
        cartItem.price = foodItem.price * newQuantity;
        cart.totalPrice += foodItem.price * quantityDifference;
        yield cart.save();
        foodItem.quantity -= quantityDifference;
        yield foodItem.save();
        res.json({ message: 'Cart updated successfully', cart });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating cart', error });
    }
});
exports.updateCartItem = updateCartItem;
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        console.log(`[INFO] Fetching addresses for userId: ${userId}`);
        if (!userId) {
            console.error('[ERROR] User ID not provided in the request');
            return res.status(400).json({ error: 'User ID is required' });
        }
        const addresses = yield addressModel_1.default.find({ user: userId });
        if (addresses.length === 0) {
            console.warn(`[WARNING] No addresses found for userId: ${userId}`);
        }
        else {
            console.log(`[SUCCESS] ${addresses.length} addresses fetched successfully for userId: ${userId}`);
        }
        res.status(200).json(addresses);
    }
    catch (error) {
        console.error(`[ERROR] Error fetching addresses for userId: ${req.params.id}. Error: {'an error meee occureddd'}`);
        res.status(500).json({ error: 'Error fetching addresses' });
    }
});
exports.getAddresses = getAddresses;
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, street, city, state, postalCode, country } = req.body;
        console.log('Request body:', req.body);
        if (!userId) {
            console.log('Error: User ID not provided in addAddress');
            return res.status(400).json({ error: 'User ID is required' });
        }
        console.log('Adding new address for userId:', userId);
        const newAddress = new addressModel_1.default({
            user: userId,
            street,
            city,
            state,
            postalCode,
            country,
        });
        yield newAddress.save();
        console.log('New address saved successfully:', newAddress);
        res.status(201).json(newAddress);
    }
    catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ error: 'Error adding address' });
    }
});
exports.addAddress = addAddress;
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting createOrder function');
    try {
        const isCOD = req.body.paymentMethod === 'COD';
        const { amount, currency, orderData } = isCOD
            ? { amount: req.body.totalAmount * 100, currency: 'INR', orderData: req.body }
            : req.body;
        console.log('Received request body:', req.body);
        const { user, address, foodItems, totalAmount, paymentMethod } = orderData;
        console.log('Order data extracted:', {
            user,
            address,
            foodItems,
            totalAmount,
            paymentMethod,
        });
        if (!amount || !currency) {
            console.log('Missing amount or currency:', { amount, currency });
            return res.status(400).json({
                success: false,
                message: 'Amount and currency are required to create an order',
            });
        }
        if (paymentMethod === 'COD') {
            console.log('Processing COD order');
            return res.status(201).json({
                success: true,
                orderId: 'COD-' + new Date().getTime(),
                amount: totalAmount,
                currency: 'INR',
                user,
                address,
                foodItems,
                totalAmount,
                paymentMethod,
            });
        }
        console.log('Creating order with Razorpay API with options:', { amount, currency });
        const order = yield razorpay.orders.create({ amount, currency });
        console.log('Order created successfully:', order);
        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            user,
            address,
            foodItems,
            totalAmount,
            paymentMethod,
        });
        console.log('Response sent successfully to the client');
    }
    catch (error) {
        console.error('Error occurred during order creation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create the order',
            error: 'An error occurred',
        });
        console.log('Error response sent to the client');
    }
});
exports.createOrder = createOrder;
const saveOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting saveOrder function');
    const { paymentId, orderId, user, address, foodItems, totalAmount, paymentMethod } = req.body;
    try {
        const newOrder = new orderModel_1.default({
            user,
            address,
            foodItems: foodItems.map((item) => ({
                foodItem: item.id,
                quantity: item.quantity,
                restaurant: item.restaurant
            })),
            totalAmount,
            paymentMethod,
            paymentId: paymentId,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
            orderStatus: 'placed',
        });
        const savedOrder = yield newOrder.save();
        console.log('Order saved successfully:', savedOrder);
        res.status(201).json({
            success: true,
            order: savedOrder,
        });
    }
    catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save the order',
        });
    }
});
exports.saveOrder = saveOrder;
const getOrderDetailss = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    console.log(`Received request to fetch order details for Payment ID: ${paymentId}`);
    try {
        console.log('Searching for the order in the database...');
        const order = yield orderModel_1.default.find({ paymentId })
            .populate('user', 'name email phoneNumber')
            .populate('address')
            .populate({
            path: 'foodItems.foodItem',
            select: 'name category cuisine price'
        });
        if (!order) {
            console.log(`Order with Payment ID ${paymentId} not found.`);
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log(`Order found: ${JSON.stringify(order)}`);
        console.log(`Returning order details for Payment ID: ${paymentId}`);
        return res.status(200).json(order);
    }
    catch (error) {
        console.error(`Error occurred while fetching order details for Payment ID: ${paymentId}`);
        console.error('Error details:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.getOrderDetailss = getOrderDetailss;
const getFoodItemByIddd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    console.log(name, "44444411111");
    try {
        const foodItem = yield fooditemModel_1.default.findOne({ name: name });
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(foodItem);
    }
    catch (error) {
        console.error('Error fetching food item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getFoodItemByIddd = getFoodItemByIddd;
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const orders = yield orderModel_1.default.find({ user: userId })
            .populate('foodItems.foodItem', 'name')
            .sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getOrdersByUserId = getOrdersByUserId;
const makeorderupdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Order ID received:", req.params.id);
        const orderId = req.params.id;
        const { id } = req.params;
        const updatedOrder = yield orderModel_1.default.findByIdAndUpdate(id, { orderStatus: 'FOOD PREPARING' }, { new: true });
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
exports.makeorderupdate = makeorderupdate;
const getOrderdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield orderModel_1.default.findById(orderId).populate('foodItems.foodItem', 'name price')
            .populate('foodItems.restaurant', 'name')
            .populate('address', 'street city state postalCode country')
            .populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Failed to fetch order details' });
    }
});
exports.getOrderdetails = getOrderdetails;
const getRestaurantss = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('hellooo i am innn');
        const restaurants = yield restaurantModel_1.default.find({});
        res.json(restaurants);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
});
exports.getRestaurantss = getRestaurantss;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('helloooooooo');
        const { restaurantId, userId } = req.body;
        const existingConversation = yield conversationModel_1.default.findOne({ restaurantId, userId });
        if (existingConversation) {
            res.status(200).json(existingConversation);
            return;
        }
        const conversation = new conversationModel_1.default({ restaurantId, userId });
        const savedConversation = yield conversation.save();
        res.status(201).json(savedConversation);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating conversation', error });
    }
});
exports.createConversation = createConversation;
const getConversationsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const conversations = yield conversationModel_1.default.find({ userId }).populate('restaurantId', 'name');
        res.status(200).json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error });
    }
});
exports.getConversationsByUser = getConversationsByUser;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId, senderId, message } = req.body;
        const content = message;
        const validConversationId = new mongoose_1.default.Types.ObjectId(conversationId);
        const validSenderId = new mongoose_1.default.Types.ObjectId(senderId);
        const newMessage = new messageModel_1.default({
            conversationId: validConversationId,
            senderId: validSenderId,
            content,
        });
        console.log(newMessage, 'messsageeee');
        const savedMessage = yield newMessage.save();
        res.status(201).json(savedMessage);
    }
    catch (error) {
        console.error('Error sending message:', error.message || error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});
exports.sendMessage = sendMessage;
const getMessagesByConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const messages = yield messageModel_1.default.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});
exports.getMessagesByConversation = getMessagesByConversation;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId, userId } = req.query;
        if (!restaurantId || !userId) {
            return res.status(400).json({ message: 'Missing restaurantId or userId' });
        }
        const messages = yield messageModel_1.default.find({
            conversationId: { $in: [restaurantId, userId] },
        }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});
exports.getMessages = getMessages;
