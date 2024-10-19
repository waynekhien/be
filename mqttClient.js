const mqtt = require('mqtt');

// Thông tin kết nối
const mqtt_server = 'mqtt://192.168.23.100:1884';
const mqtt_user = 'NguyenGiaKhien';
const mqtt_password = 'b21dccn459';

// Kết nối tới MQTT broker với thông tin xác thực
const mqttClient = mqtt.connect(mqtt_server, {
  username: mqtt_user,
  password: mqtt_password
});

// Import các hàm xử lý dữ liệu từ handlers.js
const { handleMqttData, handleLedControl } = require('./handlers');

// Hàm để subscribe vào topic sensor/data
const subscribeToSensorData = () => {
  mqttClient.on('connect', () => {
    mqttClient.subscribe('sensor/data', (err) => {
      if (!err) {
        console.log(`Đã subscribe tới topic: sensor/data`);
      } else {
        console.error(`Lỗi khi subscribe tới topic sensor/data: ${err}`);
      }
    });
  });
};

// Hàm để subscribe vào topic led/control
const subscribeToLedControl = () => {
  mqttClient.on('connect', () => {
    mqttClient.subscribe('led/control', (err) => {
      if (!err) {
        console.log(`Đã subscribe tới topic: led/control`);
      } else {
        console.error(`Lỗi khi subscribe tới topic led/control: ${err}`);
      }
    });
  });
};

// Hàm xử lý tin nhắn nhận được từ MQTT
mqttClient.on('message', (topic, message) => {
  console.log(`Nhận được dữ liệu từ topic ${topic}: ${message.toString()}`);
  
  if (topic === 'sensor/data') {
    handleMqttData(message.toString());
  } else if (topic === 'led/control') {
    handleLedControl(message.toString());
  }
});

// Hàm publish lệnh điều khiển tới MQTT
const publishControlMessage = (device, status) => {
  const message = `${device}: ${status}`;
  mqttClient.publish('led/control', message, (err) => {
    if (err) {
      console.error('Lỗi khi gửi lệnh điều khiển:', err);
    } else {
      console.log(`Đã gửi lệnh: ${message}`);
    }
  });
};

// Khởi động
const initMqttClient = () => {
  subscribeToSensorData();
  subscribeToLedControl();

};

// Xuất các hàm
module.exports = {initMqttClient, publishControlMessage};
