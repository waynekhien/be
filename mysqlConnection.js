const mysql = require('mysql2');

// Tạo kết nối tới MySQL
const db = mysql.createConnection({
  host: 'localhost',   // Địa chỉ của MySQL server
  user: 'root',        // Tên người dùng MySQL
  password: 'kba2003vip', // Mật khẩu MySQL
  database: 'iot' // Tên database bạn muốn lưu
});

// Hàm để lưu dữ liệu cảm biến vào MySQL (nhiệt độ, độ ẩm, ánh sáng, thời gian)
const saveSensorData = (temperature, humidity, light, time) => {
  const sql = `INSERT INTO sensor_data2 (temperature, humidity, light, time) VALUES (?, ?, ?, ?)`;

  db.query(sql, [temperature, humidity, light, time], (err, result) => {
    if (err) {
      console.error('Lỗi khi chèn dữ liệu vào MySQL:', err);
    } else {
      console.log('Dữ liệu đã được lưu thành công:', result.insertId);
    }
  });
};

// Hàm để lưu lịch sử hành động vào bảng action_history (thiết bị, trạng thái, thời gian)
const saveActionHistory = (device, status, time) => {
  const sql = `INSERT INTO action_history (device, status, time) VALUES (?, ?, ?)`;

  db.query(sql, [device, status, time], (err, result) => {
    if (err) {
      console.error('Lỗi khi chèn dữ liệu vào action_history:', err);
    } else {
      console.log('Lịch sử hành động đã được lưu thành công:', result.insertId);
    }
  });
};

// Xác nhận kết nối đến MySQL
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
  } else {
    console.log('Kết nối thành công MySQL');
  }
});



module.exports = {db, saveSensorData, saveActionHistory};
