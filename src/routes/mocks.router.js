import { Router } from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mockingUtils.js';
import logger from '../utils/logger.js';
import User from '../dao/models/User.js';
import Pet from '../dao/models/Pet.js';
import { fork } from 'child_process';
import path from 'path';

const router = Router();

router.get('/mockingpets', async (req, res) => {
    logger.info('Inicio');
    try {
     
        const pets = generateMockPets(20);
        logger.info('Generado correctamente');
        res.json(pets);
    } catch (error) {
        logger.error('Error en /mockingpets: ' + error.message);
        res.status(500).json({ error: 'Error generando mascotas' });
    }
});

router.get('/mockingusers', async (req, res) => {
    logger.info('Inicio endpoint /mockingusers');
    const start = Date.now();
    try {
        const users = await generateMockUsers(50);
        const duration = Date.now() - start;
        logger.info(`Generados ${users.length} usuarios en ${duration}ms`);
        res.json(users);
    } catch (error) {
        logger.error('Error en /mockingusers: ' + error.message);
        res.status(500).json({ error: 'Error generando usuarios ficticios' });
    }
});

router.post('/generateData', async (req, res) => {
    logger.info('Inicio endpoint /generateData');
    const usersCount = parseInt(req.query.users) || 0;
    const petsCount = parseInt(req.query.pets) || 0;

    const THRESHOLD = 100;
    if (usersCount > THRESHOLD || petsCount > THRESHOLD) {
        const workerPath = path.resolve('src/workers/dataWorker.js');
        const child = fork(workerPath, [], {
            env: { USERS: usersCount, PETS: petsCount }
        });

        child.on('message', (msg) => {
            if (msg.success) {
                logger.info('Datos generados exitosamente');
                res.json({ message: 'Datos generados exitosamente' });
            } else {
                logger.error('Error: ' + msg.error);
                res.status(500).json({ error: msg.error });
            }
        });

        child.on('error', (err) => {
            logger.error('Error en proceso secundario: ' + err.message);
            res.status(500).json({ error: 'Error en proceso secundario' });
        });
    } else {

        try {
            const users = await generateMockUsers(usersCount);
            const pets = generateMockPets(petsCount);

            await User.insertMany(users);
            await Pet.insertMany(pets);

            logger.info(`Generados e insertados ${users.length} usuarios y ${pets.length} mascotas`);
            res.json({ message: 'Datos generados exitosamente' });
        } catch (error) {
            logger.error('Error en /generateData: ' + error.message);
            res.status(500).json({ error: 'Error generando datos' });
        }
    }
});

export default router;