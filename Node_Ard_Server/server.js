const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Add this to enable JSON parsing

const port = 3000;

// COM2 Configuration (Receiving data from Proteus)
const portNameCOM2 = 'COM2';
const serialPortCOM2 = new SerialPort({
  path: portNameCOM2,
  baudRate: 9600,
});

serialPortCOM2.on('open', () => {
  console.log(`Serial port ${portNameCOM2} opened successfully`);
});

serialPortCOM2.on('error', (err) => {
  console.error(`Error opening serial port ${portNameCOM2}:`, err.message);
});

const parserCOM2 = serialPortCOM2.pipe(new ReadlineParser({ delimiter: '\n' }));

let latestGpsData = null;

parserCOM2.on('data', (data) => {
  console.log('Received GPS data:', data);

  const trimmedData = data.trim();
  console.log('Trimmed GPS data:', trimmedData);

  const parts = trimmedData.split(/\s+/); // Split by one or more spaces
  console.log('Split data parts:', parts);

  if (parts.length === 6 && parts[0] === 'Latitude' && parts[1] === '=' && parts[3] === 'Longitude' && parts[4] === '=') {
    const latitude = parseFloat(parts[2]);
    const longitude = parseFloat(parts[5]);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      latestGpsData = { latitude, longitude };
      console.log(`Updated GPS data: Latitude = ${latitude}, Longitude = ${longitude}`);
    } else {
      console.error('Parsed values are not numbers:', { latitude, longitude });
    }
  } else {
    console.error('Unexpected GPS data format:', trimmedData);
  }
});

// Global reference to the COM4 port
let serialPortCOM4 = null;

// Initialize COM4 connection (if it's not already open)
const initCOM4 = () => {
  if (!serialPortCOM4 || !serialPortCOM4.isOpen) {
    serialPortCOM4 = new SerialPort({
      path: 'COM4',
      baudRate: 9600,
    });

    serialPortCOM4.on('open', () => {
      console.log('Serial port COM4 opened successfully');
    });

    serialPortCOM4.on('error', (err) => {
      console.error(`Error opening COM4: ${err.message}`);
    });
  }
};

// Function to send a command to COM4 (instead of COM1)
const sendToCOM4 = (command) => {
  initCOM4(); // Initialize COM4 if not already done
  if (serialPortCOM4.isOpen) {
    serialPortCOM4.write(command, (err) => {
      if (err) {
        console.error(`Error sending command to COM4: ${err.message}`);
        return;
      }
      console.log(`Command sent to COM4: ${command.trim()}`);
    });
  } else {
    console.error('COM4 is not open. Cannot send command.');
  }
};

// Route to fetch the latest GPS data
app.get('/api/gps', (req, res) => {
  console.log('Received request for GPS data');
  if (latestGpsData) {
    console.log('Sending GPS data:', latestGpsData);
    res.json(latestGpsData); // Send the latest GPS data as a JSON response
  } else {
    console.log('No GPS data available yet');
    res.status(404).json({ message: 'No GPS data received yet' });
  }
});

// Route to control LED and Buzzer (send commands to COM4)
app.post('/api/control', (req, res) => {
  const { device, action } = req.body;

  if (!device || !action) {
    return res.status(400).json({ message: 'Device and action are required' });
  }

  const validDevices = ['LED', 'Buzzer'];
  const validActions = ['on', 'off'];

  if (!validDevices.includes(device) || !validActions.includes(action)) {
    return res.status(400).json({ message: 'Invalid device or action' });
  }

  // Convert the action to the required format
  const command = `${device}_${action.toUpperCase()}\n`;  // Example: "LED_ON" or "BUZZER_OFF"

  // Send the command to COM4 (Proteus)
  sendToCOM4(command);

  res.json({ message: `Command sent to ${device}: ${action}` });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
