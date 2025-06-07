const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSystems() {
  try {
    console.log('🔍 فحص الأنظمة في قاعدة البيانات...')
    
    const systems = await prisma.system.findMany()
    console.log(`📊 عدد الأنظمة: ${systems.length}`)
    
    if (systems.length > 0) {
      console.log('✅ أول نظام:')
      console.log({
        id: systems[0].id,
        name: systems[0].name,
        category: systems[0].category,
        isActive: systems[0].isActive
      })
    }
    
    // فحص الأنظمة النشطة فقط
    const activeSystems = await prisma.system.findMany({
      where: { isActive: true }
    })
    console.log(`🟢 عدد الأنظمة النشطة: ${activeSystems.length}`)
    
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSystems()
