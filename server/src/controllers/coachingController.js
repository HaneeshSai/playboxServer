import { prisma } from '../../utils/prismaClient.js';

export const getCoaching = async (req, res) => {
  try {
    const coachingProgram = await prisma.coachingProgram.findMany();
    res.status(200).json({ coachingProgram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};