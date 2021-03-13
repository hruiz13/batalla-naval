import io from 'socket.io-client';

const dirUrl = process.env.REACT_APP_DIR;

let socket = io(dirUrl);

export default socket;