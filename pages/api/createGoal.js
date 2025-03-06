import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await prisma.goal.create({
      data: data
    });
    res.status(200).json({ message: 'Created goal successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}