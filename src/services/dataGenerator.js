import { generateMockUsers, generateMockPets } from '../utils/mockingUtils.js';
import User from '../dao/models/User.js';
import Pet from '../dao/models/Pet.js';

export async function generateAndInsertData(usersCount, petsCount) {
    const users = await generateMockUsers(usersCount);
    const pets = generateMockPets(petsCount);
    await User.insertMany(users);
    await Pet.insertMany(pets);

    return { users: users.length, pets: pets.length };
}