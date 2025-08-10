import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export async function generateMockUsers(num) {
    const users = [];
    const passwordHash = await bcrypt.hash('coder123', 10);

    for (let i = 0; i < num; i++) {
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: passwordHash,
            role: i % 2 === 0 ? 'user' : 'admin',
            pets: []
        });
    }
    return users;
}

export function generateMockPets(num) {
    const pets = [];
    for (let i = 0; i < num; i++) {
        pets.push({
            name: faker.animal.cat(),
            specie: faker.animal.type(),
            birthDate: faker.date.birthdate({ min: 1, max: 15, mode: 'age' }),
            adopted: faker.datatype.boolean(),
            owner: null,
            image: faker.image.urlPicsumPhotos()
        });
    }
    return pets;
}