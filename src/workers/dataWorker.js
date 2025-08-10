import mongoose from 'mongoose';
import { generateAndInsertData } from '../services/dataGenerator.js';

const usersCount = parseInt(process.env.USERS) || 0;
const petsCount = parseInt(process.env.PETS) || 0;

(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/adoptme'); // Ajusta la URI si es necesario
        await generateAndInsertData(usersCount, petsCount);
        process.send({ success: true });
        process.exit(0);
    } catch (error) {
        process.send({ success: false, error: error.message });
        process.exit(1);
    }
})();