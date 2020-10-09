import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: 'Room',
        required: true
    } 
});


export default mongoose.model('Message', messageSchema);