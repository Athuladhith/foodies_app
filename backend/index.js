"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const deliveryboyRoutes_1 = __importDefault(require("./routes/deliveryboyRoutes"));
const restaurantRoutes_1 = __importDefault(require("./routes/restaurantRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
(0, db_1.default)()
    .then(() => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/api/users', userRoutes_1.default);
    app.use('/api/admin', adminRoutes_1.default);
    app.use('/api/restaurant', restaurantRoutes_1.default);
    app.use('/api/deliveryperson', deliveryboyRoutes_1.default);
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('joinRoom', ({ roomId }) => {
            console.log(roomId, 'roomiddddd');
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });
        socket.on('userStatusUpdate', ({ userId, isActive }) => {
            console.log(userId, 'userrriddddd in message');
            console.log(isActive, 'isactiveeeeinnnnnnnserverr');
            io.emit('userStatusUpdate', { userId, isActive });
        });
        socket.on('sendMessage', (data) => {
            const { conversationId, message } = data;
            console.log(data, 'serverrdataaa');
            io.emit('receiveMessage', data);
        });
        socket.on('orderReadyForDelivery', (restaurant) => {
            console.log(restaurant, 'hellooo');
            io.emit('orderReadyForDelivery', restaurant);
        });
        socket.on('acceptOrder', (data) => {
            console.log(data, 'data from delivery boy');
            const update = { id: data, orderStatus: 'OUT FOR DELIVERY' };
            io.emit('acceptOrder', update);
        });
        socket.on('completeOrder', (data) => {
            console.log(data, 'data from delivery boy');
            const update = { id: data, orderStatus: 'DELIVERY COMPLETED' };
            io.emit('completeOrder', update);
        });
        socket.on('ordertouser', (data) => {
            console.log(data, 'data from restaurant food ready');
            const update = { id: data, orderStatus: 'FOOD READY' };
            io.emit('ordertouser', update);
        });
        socket.on('foodpreparing', (data) => {
            console.log(data, 'data from restaurant food pre');
            const update = { id: data, orderStatus: 'FOOD PREPARING' };
            io.emit('foodpreparing', update);
        });
        socket.on('send', (message) => {
            console.log('Received message on server from restaurant:', message);
            io.emit('receive', message);
        });
        socket.on('joinRoom', (restaurantId) => {
            socket.join(restaurantId);
            console.log(`Restaurant ${restaurantId} joined room: ${restaurantId}`);
        });
        socket.on('orderNotification', ({ restaurantId, orderDetails }) => {
            io.to(restaurantId).emit('orderNotification', orderDetails);
        });
        socket.on('delivery', (orderdetails) => {
            console.log(orderdetails, "att ser ve dev");
            io.emit('delivery', orderdetails);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
