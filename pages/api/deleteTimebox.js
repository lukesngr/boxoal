import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    try {
      const data = req.body;

      await prisma.timeBox.delete({
        where: {
          id: data.id
        },
        include: {
          recordedTimeboxes: true,
        },
      });

      res.status(200).json({ message: 'TimeBox deleted successfully' });
    } catch (error) {
      console.error('Error creating timebox:', error);
  
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  }