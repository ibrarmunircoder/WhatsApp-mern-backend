import express from 'express';
import Message from '../models/messages.js';

const router = express.Router();


// @desc  store messages
// Method POST /messages/new
router.post('/messages/new', async (req, res) => {
    const message = new Message(req.body);

    try {
        const savedMessage = await message.save();
        res.status(201).send(savedMessage);
    }catch(e) {
        res.status(400).send({ error: e.message });
    }
});

// @desc  get messages
// Method Get /messages/sync
router.get('/messages/sync', async (req, res) => {
    try {
        const messages = await Message.find({}).lean();
        res.status(200).send(messages);
    }catch(e) {
        res.status(500).send({ error: e.message });
    }
});

// @desc  get messages based on roomId
// Method Get /messages/sync/:roomId
router.get('/messages/sync/:roomId', async (req, res) => {
    const id = req.params.roomId;
    try {
        const messages = await Message.find({ room: id }).populate('room').sort({ timestamp: 'asc' }).lean();
        res.status(200).send(messages);
    }catch(e) {
        res.status(500).send({ error: e.message });
    }
});



export default router;