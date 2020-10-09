// importing
import express from 'express';
import mongoose from 'mongoose';
import messagesRoutes from './routes/messages.js';
import roomsRoutes from './routes/rooms.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: '1086789',
    key: '18144b6d7169d55d17c2',
    secret: '65f0f9c75867bda78e18',
    cluster: 'mt1',
    encrypted: true
});

// middleware
app.use(express.json());

app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
// });

// DB Config
const connection_url = 'mongodb+srv://admin:mR0NNF9ZJxh1n58z@cluster0.ks08u.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
},(error, conn) => {
    if(error){
        return console.error(error.message);
    }
    console.log(conn.connection.host);
    
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("DB Connected!!");
    const messageCollection = db.collection('messages');
    const messageStream = messageCollection.watch();

    const roomCollection = db.collection('rooms');
    const roomStream = roomCollection.watch();

    messageStream.on('change', (change) => {
        if(change.operationType == 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('message', 'inserted', {
                message: messageDetails.message,
                name: messageDetails.name,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            });
        }else {
            console.log('Error triggering Pusher');
        }
    });
    roomStream.on('change', (change) => {
        if(change.operationType == 'insert') {
            const roomDetails = change.fullDocument;
            pusher.trigger('room', 'inserted', {
                name: roomDetails.name,
                _id: roomDetails._id
            });
        }else {
            console.log('Error Triggering Pusher');
        }
    });
});

//?????

// api Routes
app.use(messagesRoutes);
app.use(roomsRoutes);

// listener
app.listen(port, () => {
    console.log(`Server is running on localhost://127.0.0.0.1:${port}`);
});


// mR0NNF9ZJxh1n58z