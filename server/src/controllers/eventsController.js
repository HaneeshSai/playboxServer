import { prisma } from '../../utils/prismaClient.js';

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};