import { io } from 'socket.io-client';

// Adjust the URL based on your server address
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  upgrade: true, 
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server'); // Check if this logs
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server'); // Check if this logs on disconnect
});
// socket.on('connect', () => {
//   console.log('Connected to Socket.IO server');
// });

// socket.on('response', (data) => {
//   console.log('Received response:', data);
// });

// socket.on('refresh-clips', (data) => {
//   console.log('Received refresh-clips event:', data);
// });
// socket.onAny((event, data) => {
//   console.log(`Received event ${event} with data:`, data);
// });

export default socket;