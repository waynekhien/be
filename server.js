const express = require('express');
const cors = require('cors');
require('./mysqlConnection'); // Đảm bảo tệp này thiết lập kết nối MySQL đúng
const { initMqttClient } = require('./mqttClient'); // Tích hợp MQTT
const dataRoutes = require('./index'); // Nhập các route từ tệp routes

const app = express();

// Cấu hình CORS để frontend (React) có thể kết nối
app.use(cors({
    origin: 'http://localhost:3000', // Địa chỉ frontend
    methods: ['GET', 'POST'],
}));

app.use(express.json()); // Cho phép sử dụng JSON
app.use(express.urlencoded({ extended: true })); // Hỗ trợ url-encoded

// Đăng ký các route
app.use('/api', dataRoutes);

// Xử lý lỗi
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || 'Internal server error',
    });
});

// Khởi động client MQTT
initMqttClient();

// Khởi động server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
