const { configDotenv } = require('dotenv');
const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
const { hash } = require('bcrypt');
configDotenv();

const uri = process.env.DB_CONNECTION_STRING || '';
const client = new MongoClient(uri);

module.exports = {
  async up(db) {
    try {
      const randomAddressString = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`;

      const hashPassword = () => hash('test@123', parseInt(process.env.SALT, 10));

      const createRandomUser = async (role) => ({
        email: faker.internet.email({ provider: 'example.fakerjs.dev' }),
        password: await hashPassword(),
        name: faker.person.firstName(),
        role,
        gender: faker.person.sex(),
        image: faker.image.avatar(),
        address: randomAddressString,
      })
      const users = Array.from({ length: 2 }, () => createRandomUser('user'));
      const usersArray = [await createRandomUser('admin'), ...await Promise.all(users)];
      await db.collection('users').insertMany(usersArray);
      console.log('Migration UP: Successfully created data');
    } catch (error) {
      console.error('Error inserting data', error);
      throw error;
    } finally {
      await client.close();
    }
  },

  async down(db) {
    try {
      await db.collection('users').deleteMany({});
      console.log('Migration DOWN: Successfully deleted data');
    } catch (error) {
      console.error('Error deleting data', error);
      throw error;
    } finally {
      await client.close();
    }
  }
};
