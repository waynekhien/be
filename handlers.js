// handlers.js
const { saveSensorData, saveActionHistory } = require('./mysqlConnection'); // Import các hàm lưu dữ liệu

// Hàm lấy thời gian theo múi giờ Việt Nam
const getVietnamTime = () => {
    // Lấy thời gian hiện tại theo múi giờ Việt Nam
    const date = new Date();
    
    // Tính toán giờ theo UTC+7 cho Việt Nam
    const vietnamTime = new Date(date.getTime()); // +7 giờ
  
    // Định dạng thời gian theo kiểu YYYY-MM-DD HH:mm:ss
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    const hour = String(vietnamTime.getHours()).padStart(2, '0');
    const minute = String(vietnamTime.getMinutes()).padStart(2, '0');
    const second = String(vietnamTime.getSeconds()).padStart(2, '0');
  
    // Trả về định dạng 'YYYY-MM-DD HH:mm:ss'
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// Hàm xử lý dữ liệu nhận từ MQTT
const handleMqttData = (message) => {
    try {
        const data = JSON.parse(message);
        console.log('Dữ liệu đã parse:', data);

        const time = getVietnamTime();
        saveSensorData(data.temperature, data.humidity, data.light, time);
    } catch (error) {
        console.error('Lỗi khi parse JSON:', error);
    }
};


const handleLedControl = (message) => {
    console.log(`Lệnh điều khiển nhận được: ${message}`);
    
    const [device, status] = message.split(': ').map(item => item.trim());

    if (['led', 'fan', 'laptop'].includes(device)) {
        if (status === 'on') {
            console.log(`Bật ${device}`);
            // Logic điều khiển thiết bị bật ở đây
            
            // Lưu vào action history
            const time = getVietnamTime();
            saveActionHistory(device, 'on', time); // Lưu vào bảng action history
        } else if (status === 'off') {
            console.log(`Tắt ${device}`);
            // Logic điều khiển thiết bị tắt ở đây
            
            // Lưu vào action history
            const time = getVietnamTime();
            saveActionHistory(device, 'off', time); // Lưu vào bảng action history
        } else {
            console.error(`Trạng thái ${device} không hợp lệ:`, status);
        }
    } else {
        console.error('Thiết bị không hợp lệ:', device);
    }
};


module.exports = { handleMqttData, handleLedControl };
