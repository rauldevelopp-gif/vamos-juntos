const { prisma } = require('../lib/prisma')

async function main() {
  try {
    console.log('Prisma instance:', prisma)
    const users = await prisma.user.findMany({ take: 1 })
    console.log('Connection successful:', users)
  } catch (e) {
    console.error('Connection failed:', e)
  } finally {
    if (prisma && prisma.$disconnect) await prisma.$disconnect()
  }
}

main()
