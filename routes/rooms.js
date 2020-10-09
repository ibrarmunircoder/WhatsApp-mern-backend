import express from 'express';
import Room from '../models/rooms.js';

const router = express.Router();


// desc    process new Room
// Method  POST  /room/new

router.post('/room/new', async (req, res) => {
    const room = new Room(req.body);
    try {
        await room.save();
        res.status(201).send();
    }catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.get('/room/sync', async (req, res) => {
    try {
        const rooms = await Room.find({}).lean();
        res.status(200).send(rooms);
    }catch(e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/room/:roomId', async (req, res) => {
    const id = req.params.roomId;
    try {
        const room = await Room.findById(id);
        res.status(200).send(room);
    }catch(e) {
        res.status(500).send({ error: e.message });
    }
});


export default router;