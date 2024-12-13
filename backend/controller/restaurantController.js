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
exports.sendMessage = exports.getMessages = exports.getConversations = exports.getFilteredOrders = exports.getDashboardData = exports.makeorderupdate = exports.getOrderstorestaurant = exports.updateFoodItem = exports.getFoodItemById = exports.updateRestaurant = exports.getRestaurantById = exports.Deletecatagory = exports.Deletecuisine = exports.DeleteFoodItem = exports.getFooditem = exports.getCuisine = exports.getCategories = exports.addFoodItem = exports.addCuisine = exports.addCategory = exports.restaurantlogin = exports.blockUnblockRestaurant = exports.getRestaurants = exports.registerRestaurant = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = __importDefault(require("multer"));
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const cuisineModel_1 = __importDefault(require("../models/cuisineModel"));
const fooditemModel_1 = __importDefault(require("../models/fooditemModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.registerRestaurant = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { restaurantName, ownerName, email, phoneNumber, address, password, avatar } = req.body;
        try {
            const restaurantExists = yield restaurantModel_1.default.findOne({ email });
            if (restaurantExists) {
                res.status(400).json({ message: 'Restaurant already exists' });
                return;
            }
            const newRestaurant = new restaurantModel_1.default({
                restaurantName,
                ownerName,
                email,
                phoneNumber,
                address,
                password: yield bcryptjs_1.default.hash(password, 10),
                avatar,
            });
            yield newRestaurant.save();
            res.status(201).json({
                message: 'Restaurant registered successfully.',
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Registration failed, please try again.' });
        }
    }),
];
const getRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurantModel_1.default.find({});
        res.json(restaurants);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
});
exports.getRestaurants = getRestaurants;
const blockUnblockRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(1001);
        const { id } = req.params;
        const { isBlocked } = req.body;
        const restaurant = yield restaurantModel_1.default.findById(id);
        if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
        }
        restaurant.isBlocked = isBlocked;
        yield restaurant.save();
        res.status(200).json({ message: `Restaurant has been ${restaurant.isBlocked ? 'blocked' : 'unblocked'}` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the user status' });
    }
});
exports.blockUnblockRestaurant = blockUnblockRestaurant;
const restaurantlogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("r1");
    const { email, password } = req.body;
    try {
        const restaurant = yield restaurantModel_1.default.findOne({ email });
        console.log(restaurant, "restoaurant user");
        if (!restaurant) {
            res.status(400).json({ message: 'Email not registered' });
            return;
        }
        if (restaurant.password && (yield bcryptjs_1.default.compare(password, restaurant.password))) {
            const token = jsonwebtoken_1.default.sign({ userId: restaurant._id.toHexString(), email: restaurant.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login successful',
                userId: restaurant._id.toHexString(),
                restaurant,
                token,
            });
        }
        else {
            res.status(400).json({ message: 'Wrong password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.restaurantlogin = restaurantlogin;
exports.addCategory = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description } = req.body;
        const avatar = req.file;
        try {
            const categoryExists = yield categoryModel_1.default.findOne({ name });
            if (categoryExists) {
                res.status(400).json({ message: 'Category already exists' });
                return;
            }
            const newCategory = new categoryModel_1.default({
                name,
                description,
                avatar: avatar ? avatar.buffer.toString('base64') : 'No avatar provided',
            });
            yield newCategory.save();
            res.status(201).json({
                message: 'Category registered successfully.',
                category: newCategory,
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Registration failed, please try again.' });
        }
    }),
];
exports.addCuisine = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description } = req.body;
        const avatar = req.file;
        try {
            const cuisineExists = yield cuisineModel_1.default.findOne({ name });
            if (cuisineExists) {
                res.status(400).json({ message: 'Cuisine already exists' });
                return;
            }
            const newCuisine = new cuisineModel_1.default({
                name,
                description,
                avatar: avatar ? avatar.buffer.toString('base64') : 'No avatar provided',
            });
            yield newCuisine.save();
            res.status(201).json({
                message: 'Cuisine registered successfully.',
                cuisine: newCuisine,
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Registration failed, please try again.' });
        }
    })
];
exports.addFoodItem = [
    upload.single('image'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, price, quantity, category, cuisine, restaurantid, foodType } = req.body;
        const image = req.file;
        try {
            const foodItemExists = yield fooditemModel_1.default.findOne({ name });
            if (foodItemExists) {
                res.status(400).json({ message: 'Food item with this name already exists' });
                return;
            }
            const categoryExists = yield categoryModel_1.default.findById(category);
            const cuisineExists = yield cuisineModel_1.default.findById(cuisine);
            console.log('elloooo');
            if (!categoryExists || !cuisineExists) {
                res.status(400).json({ message: 'Invalid category or cuisine' });
                return;
            }
            console.log('yessss');
            if (!mongoose_1.default.Types.ObjectId.isValid(restaurantid)) {
                console.log('noooooo');
                res.status(400).json({ message: 'Invalid restaurant ID' });
                return;
            }
            const validFoodTypes = ['Veg', 'Non-Veg'];
            if (!validFoodTypes.includes(foodType)) {
                res.status(400).json({ message: 'Invalid food type. Must be either Veg or Non-Veg' });
                return;
            }
            console.log('down');
            const restaurantId = new mongoose_1.default.Types.ObjectId(restaurantid);
            const newFoodItem = new fooditemModel_1.default({
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10),
                category,
                cuisine,
                image: image ? image.buffer.toString('base64') : 'No image provided',
                restaurant: restaurantId,
                foodType,
            });
            yield newFoodItem.save();
            res.status(201).json({
                message: 'Food item added successfully.',
                foodItem: newFoodItem,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add food item. Please try again.' });
        }
    }),
];
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel_1.default.find({});
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});
exports.getCategories = getCategories;
const getCuisine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuisines = yield cuisineModel_1.default.find({});
        res.json(cuisines);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch cusine' });
    }
});
exports.getCuisine = getCuisine;
const getFooditem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('helooooo');
    try {
        const { name, category } = req.query;
        console.log(req.query);
        let query = {};
        if (name) {
            query = Object.assign(Object.assign({}, query), { name: { $regex: name, $options: 'i' } });
        }
        if (category) {
            query = Object.assign(Object.assign({}, query), { category });
        }
        const fooditem = yield fooditemModel_1.default.find(query).populate('category').sort({ createdAt: -1 });
        res.json(fooditem);
    }
    catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ message: 'Failed to fetch food items' });
    }
});
exports.getFooditem = getFooditem;
const DeleteFoodItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('enterrrr');
        const { id } = req.params;
        const foodItem = yield fooditemModel_1.default.findByIdAndDelete(id);
        console.log('yesssss');
        if (!foodItem) {
            console.log('noooo');
            res.status(404).json({ message: 'Food item not found' });
            return;
        }
        res.status(200).json({ message: 'Food item has been deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the food item' });
    }
});
exports.DeleteFoodItem = DeleteFoodItem;
const Deletecuisine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('enterrrr');
        const { id } = req.params;
        const cuisine = yield cuisineModel_1.default.findByIdAndDelete(id);
        console.log('yesssss');
        if (!cuisine) {
            console.log('noooo');
            res.status(404).json({ message: 'Food item not found' });
            return;
        }
        res.status(200).json({ message: 'Food item has been deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the food item' });
    }
});
exports.Deletecuisine = Deletecuisine;
const Deletecatagory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('enterrrr');
        const { id } = req.params;
        console.log(req.params, 'paramssss');
        const catagory = yield categoryModel_1.default.findByIdAndDelete(id);
        console.log('yesssss');
        if (!catagory) {
            console.log('noooo');
            res.status(404).json({ message: 'Food item not found' });
            return;
        }
        res.status(200).json({ message: 'Food item has been deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the food item' });
    }
});
exports.Deletecatagory = Deletecatagory;
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('get enter');
    const { id } = req.params;
    console.log(id, 'gotid');
    try {
        console.log('get try');
        const restaurant = yield restaurantModel_1.default.findById(id).exec();
        console.log(restaurant, 'restaurantttttttttt');
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        console.log('over');
        res.json(restaurant);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getRestaurantById = getRestaurantById;
exports.updateRestaurant = [
    upload.single('avatar'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { restaurantName, address, phoneNumber, avatar } = req.body;
        console.log('Request Params:', req.params);
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', avatar);
        try {
            if (!id) {
                console.log('No Restaurant ID provided.');
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }
            console.log('Restaurant ID:', id);
            const updateData = { restaurantName, address, phoneNumber, avatar };
            console.log('Initial Update Data:', updateData);
            console.log('Updating restaurant in database...');
            const updatedRestaurant = yield restaurantModel_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!updatedRestaurant) {
                console.log('Restaurant not found for ID:', id);
                res.status(404).json({ message: 'Restaurant not found' });
                return;
            }
            console.log('Updated Restaurant:', updatedRestaurant);
            res.status(200).json(updatedRestaurant);
        }
        catch (error) {
            console.error('Error updating restaurant:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
];
const getFoodItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const foodItem = yield fooditemModel_1.default.findById(id).exec();
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(foodItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getFoodItemById = getFoodItemById;
exports.updateFoodItem = [
    upload.single('image'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { name, price, quantity, category, cuisine, image } = req.body;
        console.log('Request Params:', req.params);
        console.log('Request Body:', req.body);
        try {
            if (!id) {
                console.log('No Food Item ID provided.');
                res.status(400).json({ message: 'Food Item ID is required' });
                return;
            }
            console.log('Food Item ID:', id);
            let processedImage = image;
            if (processedImage && processedImage.startsWith('data:image/jpeg;base64,')) {
                processedImage = processedImage.replace(/^data:image\/jpeg;base64,/, '');
            }
            const updateData = {
                name,
                price,
                quantity,
                category,
                cuisine,
                image: processedImage
            };
            console.log('Updating food item in database...');
            const updatedFoodItem = yield fooditemModel_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!updatedFoodItem) {
                console.log('Food item not found for ID:', id);
                res.status(404).json({ message: 'Food item not found' });
                return;
            }
            console.log('Updated Food Item:', updatedFoodItem);
            res.status(200).json(updatedFoodItem);
        }
        catch (error) {
            console.error('Error updating food item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
];
const getOrderstorestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const orders = yield orderModel_1.default.find({ "foodItems.restaurant": id })
            .populate('user', 'name email')
            .populate('foodItems.foodItem', 'name category cuisine price')
            .populate('address', 'street city postalCode');
        console.log(orders, 'orders from backend');
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});
exports.getOrderstorestaurant = getOrderstorestaurant;
const makeorderupdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Order ID received:", req.params.id);
        const orderId = req.params.id;
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = yield orderModel_1.default.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
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
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { restaurantId } = req.params;
    console.log(`Restaurant ID: ${restaurantId}`);
    try {
        console.log("Fetching total revenue...");
        const totalRevenueData = yield orderModel_1.default.aggregate([
            { $unwind: '$foodItems' },
            { $match: { 'foodItems.restaurant': new mongoose_1.default.Types.ObjectId(restaurantId) } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                },
            },
        ]);
        console.log('Total Revenue:', ((_a = totalRevenueData[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0);
        const totalRevenue = ((_b = totalRevenueData[0]) === null || _b === void 0 ? void 0 : _b.totalRevenue) || 0;
        console.log(`Total Revenue: ${totalRevenue}`);
        console.log("Fetching all orders...");
        const orders = yield orderModel_1.default.aggregate([
            { $unwind: '$foodItems' },
            { $match: { 'foodItems.restaurant': new mongoose_1.default.Types.ObjectId(restaurantId) } },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: 'foodItems.foodItem',
                    foreignField: '_id',
                    as: 'foodItemDetails',
                },
            },
            { $unwind: '$foodItemDetails' },
            {
                $group: {
                    _id: '$_id',
                    user: { $first: '$user' },
                    address: { $first: '$address' },
                    createdAt: { $first: '$createdAt' },
                    orderStatus: { $first: '$orderStatus' },
                    paymentMethod: { $first: '$paymentMethod' },
                    paymentStatus: { $first: '$paymentStatus' },
                    totalAmount: { $first: '$totalAmount' },
                    foodItems: { $push: { foodItem: '$foodItemDetails.name', quantity: '$foodItems.quantity', price: '$foodItemDetails.price' } },
                },
            },
        ]);
        console.log(`Fetched ${orders.length} orders`);
        console.log("Calculating revenue by category...");
        const revenueByCategory = yield orderModel_1.default.aggregate([
            { $unwind: '$foodItems' },
            { $match: { 'foodItems.restaurant': new mongoose_1.default.Types.ObjectId(restaurantId) } },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: 'foodItems.foodItem',
                    foreignField: '_id',
                    as: 'foodItemDetails',
                },
            },
            { $unwind: '$foodItemDetails' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'foodItemDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            { $unwind: '$categoryDetails' },
            {
                $group: {
                    _id: '$categoryDetails.name',
                    revenue: { $sum: '$foodItems.quantity' },
                },
            },
            {
                $project: {
                    category: '$_id',
                    revenue: 1,
                    _id: 0,
                },
            },
        ]);
        console.log("Revenue by Category:", revenueByCategory);
        res.status(200).json({
            totalRevenue,
            orders,
            revenueByCategory,
        });
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});
exports.getDashboardData = getDashboardData;
const getFilteredOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;
    console.log(`Restaurant ID: ${restaurantId}`);
    console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
    try {
        console.log("Fetching filtered orders...");
        const filteredOrders = yield orderModel_1.default.find({
            restaurant: restaurantId,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).sort({ createdAt: -1 });
        console.log(`Fetched ${filteredOrders.length} filtered orders`);
        res.status(200).json({ filteredOrders });
    }
    catch (error) {
        console.error('Error filtering orders by date:', error);
        res.status(500).json({ message: 'Error filtering orders by date' });
    }
});
exports.getFilteredOrders = getFilteredOrders;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.id;
        console.log(restaurantId, 'restaurantiddd');
        if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'Invalid restaurantId format' });
        }
        const conversations = yield conversationModel_1.default.find({ restaurantId }).populate('userId');
        console.log(conversations, 'conversationnn');
        if (!conversations.length) {
            return res.status(404).json({ message: 'No conversations found for this restaurant' });
        }
        res.status(200).json(conversations);
        console.log(conversations, 'Fetched conversations');
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching conversations', error });
    }
});
exports.getConversations = getConversations;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationId = req.params.conversationId;
        const messages = yield messageModel_1.default.find({ conversationId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});
exports.getMessages = getMessages;
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
        console.log(newMessage, 'messsageeeerrrrrrrrrrrrrrrrrr');
        const savedMessage = yield newMessage.save();
        res.status(201).json(savedMessage);
    }
    catch (error) {
        console.error('Error sending message:', error.message || error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});
exports.sendMessage = sendMessage;
