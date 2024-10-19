const { initMqttClient, publishControlMessage } = require('./mqttClient');

// Khởi động client MQTT
initMqttClient();
const express = require('express');
const router = express.Router();
const {db} = require('./mysqlConnection'); // Đảm bảo bạn đã xuất db từ tệp kết nối


// API để lấy dữ liệu từ MySQL
router.get('/datasensor', (req, res) => {
    const query = 'SELECT * FROM sensor_data2'; // Thay đổi tên bảng nếu cần
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Gửi kết quả về frontend
    });
});

// api 20 gia tri gan nhat
router.get('/datasensor/recent', (req, res) => {
    const query = 'SELECT * FROM sensor_data2 ORDER BY time DESC LIMIT 20'; // Sắp xếp theo thời gian và lấy 20 hàng
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Gửi kết quả về frontend
    });
});


router.post('/control', (req, res) => {
    const { device, status } = req.body; // Lấy dữ liệu từ request body
  
    if (!device || !status) {
      return res.status(400).json({ error: 'Device and status are required' });
    }
  
    const query = 'INSERT INTO action_history (device, status) VALUES (?, ?)'; // Đảm bảo tên cột đúng
  
    // Lưu vào MySQL và gửi lệnh qua MQTT
    db.query(query, [device, status], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Failed to insert data' });
      }
  
      // Publish message điều khiển qua MQTT
      publishControlMessage(device, status);
  
      res.status(200).json({ message: 'Data inserted successfully', id: result.insertId });
    });
  });

  router.get('/history', (req, res) => {
    const query = 'SELECT * FROM action_history';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Gửi kết quả về frontend
    });
});


module.exports = router;
