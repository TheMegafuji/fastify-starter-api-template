import fastify from '../server';
import { connect } from '../config/db.config';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connect();
      isConnected = true;
      console.log('Database connection established');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  }

  await fastify.ready();
  fastify.server.emit('request', req, res);
}
