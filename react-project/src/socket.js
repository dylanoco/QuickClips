import { io } from 'socket.io-client';

// Adjust the URL based on your server address
const socket = io('http://localhost:5000');

socket.on('connect', () => {
    
  console.log('Connected to Socket.IO server');
  transports: ['websocket'];
});

socket.on('response', (data) => {
  console.log('Received response:', data);
});

export default socket;
