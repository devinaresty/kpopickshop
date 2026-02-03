import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database cleared');

  const user1 = await prisma.user.create({
    data: {
      email: 'admin@kpopick.com',
      name: 'Admin KPopick',
      password: await bcrypt.hash('admin123', 10),
      phone: '08123456789',
      address: 'Jakarta, Indonesia',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('user123', 10),
      phone: '08987654321',
      address: 'Surabaya, Indonesia',
    },
  });

  console.log('✅ Users created');

  // ========== PARENT CATEGORIES ==========
  const girlGroup = await prisma.category.create({
    data: {
      name: 'Girl Group',
      slug: 'girl-group',
      description: 'K-pop Girl Groups',
    },
  });

  const boyGroup = await prisma.category.create({
    data: {
      name: 'Boy Group',
      slug: 'boy-group',
      description: 'K-pop Boy Groups',
    },
  });

  // ========== GIRL GROUP ARTISTS (15 total) ==========
  const categoryAespa = await prisma.category.create({
    data: {
      name: 'aespa',
      slug: 'aespa',
      description: 'aespa Products',
      image: 'https://via.placeholder.com/300x300?text=aespa',
      parentId: girlGroup.id,
    },
  });

  const categoryBabymonster = await prisma.category.create({
    data: {
      name: 'BABYMONSTER',
      slug: 'babymonster',
      description: 'BABYMONSTER Products',
      image: 'https://via.placeholder.com/300x300?text=BABYMONSTER',
      parentId: girlGroup.id,
    },
  });

  const categoryBlackpink = await prisma.category.create({
    data: {
      name: 'BLACKPINK',
      slug: 'blackpink',
      description: 'BLACKPINK Products',
      image: 'https://via.placeholder.com/300x300?text=BLACKPINK',
      parentId: girlGroup.id,
    },
  });

  const categoryIllit = await prisma.category.create({
    data: {
      name: 'ILLIT',
      slug: 'illit',
      description: 'ILLIT Products',
      image: 'https://via.placeholder.com/300x300?text=ILLIT',
      parentId: girlGroup.id,
    },
  });

  const categoryIve = await prisma.category.create({
    data: {
      name: 'IVE',
      slug: 'ive',
      description: 'IVE Products',
      image: 'https://via.placeholder.com/300x300?text=IVE',
      parentId: girlGroup.id,
    },
  });

  const categoryItzy = await prisma.category.create({
    data: {
      name: 'ITZY',
      slug: 'itzy',
      description: 'ITZY Products',
      image: 'https://via.placeholder.com/300x300?text=ITZY',
      parentId: girlGroup.id,
    },
  });

  const categoryKatseye = await prisma.category.create({
    data: {
      name: 'KATSEYE',
      slug: 'katseye',
      description: 'KATSEYE Products',
      image: 'https://via.placeholder.com/300x300?text=KATSEYE',
      parentId: girlGroup.id,
    },
  });

  const categoryHearts2Hearts = await prisma.category.create({
    data: {
      name: 'Hearts2Hearts',
      slug: 'hearts2hearts',
      description: 'Hearts2Hearts Products',
      image: 'https://via.placeholder.com/300x300?text=Hearts2Hearts',
      parentId: girlGroup.id,
    },
  });

  const categoryLeSserafim = await prisma.category.create({
    data: {
      name: 'LE SSERAFIM',
      slug: 'le-sserafim',
      description: 'LE SSERAFIM Products',
      image: 'https://via.placeholder.com/300x300?text=LE+SSERAFIM',
      parentId: girlGroup.id,
    },
  });

  const categoryNewjeans = await prisma.category.create({
    data: {
      name: 'NewJeans',
      slug: 'newjeans',
      description: 'NewJeans Products',
      image: 'https://via.placeholder.com/300x300?text=NewJeans',
      parentId: girlGroup.id,
    },
  });

  const categoryNmixx = await prisma.category.create({
    data: {
      name: 'NMIXX',
      slug: 'nmixx',
      description: 'NMIXX Products',
      image: 'https://via.placeholder.com/300x300?text=NMIXX',
      parentId: girlGroup.id,
    },
  });

  const categoryRedVelvet = await prisma.category.create({
    data: {
      name: 'Red Velvet',
      slug: 'red-velvet',
      description: 'Red Velvet Products',
      image: 'https://via.placeholder.com/300x300?text=Red+Velvet',
      parentId: girlGroup.id,
    },
  });

  const categoryTwice = await prisma.category.create({
    data: {
      name: 'TWICE',
      slug: 'twice',
      description: 'TWICE Products',
      image: 'https://via.placeholder.com/300x300?text=TWICE',
      parentId: girlGroup.id,
    },
  });

  const categoryStayc = await prisma.category.create({
    data: {
      name: 'STAYC',
      slug: 'stayc',
      description: 'STAYC Products',
      image: 'https://via.placeholder.com/300x300?text=STAYC',
      parentId: girlGroup.id,
    },
  });

  const categoryTriples = await prisma.category.create({
    data: {
      name: 'tripleS',
      slug: 'triples',
      description: 'tripleS Products',
      image: 'https://via.placeholder.com/300x300?text=tripleS',
      parentId: girlGroup.id,
    },
  });

  // ========== BOY GROUP ARTISTS (11 total) ==========
  const categoryAteez = await prisma.category.create({
    data: {
      name: 'ATEEZ',
      slug: 'ateez',
      description: 'ATEEZ Products',
      image: 'https://via.placeholder.com/300x300?text=ATEEZ',
      parentId: boyGroup.id,
    },
  });

  const categoryBTS = await prisma.category.create({
    data: {
      name: 'BTS',
      slug: 'bts',
      description: 'Bangtan Boys Products',
      image: 'https://via.placeholder.com/300x300?text=BTS',
      parentId: boyGroup.id,
    },
  });

  const categoryExo = await prisma.category.create({
    data: {
      name: 'EXO',
      slug: 'exo',
      description: 'EXO Products',
      image: 'https://via.placeholder.com/300x300?text=EXO',
      parentId: boyGroup.id,
    },
  });

  const categoryNct127 = await prisma.category.create({
    data: {
      name: 'NCT 127',
      slug: 'nct-127',
      description: 'NCT 127 Products',
      image: 'https://via.placeholder.com/300x300?text=NCT+127',
      parentId: boyGroup.id,
    },
  });

  const categoryNctDream = await prisma.category.create({
    data: {
      name: 'NCT DREAM',
      slug: 'nct-dream',
      description: 'NCT DREAM Products',
      image: 'https://via.placeholder.com/300x300?text=NCT+DREAM',
      parentId: boyGroup.id,
    },
  });

  const categoryNctWish = await prisma.category.create({
    data: {
      name: 'NCT WISH',
      slug: 'nct-wish',
      description: 'NCT WISH Products',
      image: 'https://via.placeholder.com/300x300?text=NCT+WISH',
      parentId: boyGroup.id,
    },
  });

  const categoryRiize = await prisma.category.create({
    data: {
      name: 'RIIZE',
      slug: 'riize',
      description: 'RIIZE Products',
      image: 'https://via.placeholder.com/300x300?text=RIIZE',
      parentId: boyGroup.id,
    },
  });

  const categorySeventeen = await prisma.category.create({
    data: {
      name: 'SEVENTEEN',
      slug: 'seventeen',
      description: 'SEVENTEEN Products',
      image: 'https://via.placeholder.com/300x300?text=SEVENTEEN',
      parentId: boyGroup.id,
    },
  });

  const categoryStrayKids = await prisma.category.create({
    data: {
      name: 'Stray Kids',
      slug: 'stray-kids',
      description: 'Stray Kids Products',
      image: 'https://via.placeholder.com/300x300?text=Stray+Kids',
      parentId: boyGroup.id,
    },
  });

  const categoryTheBoyz = await prisma.category.create({
    data: {
      name: 'THE BOYZ',
      slug: 'the-boyz',
      description: 'THE BOYZ Products',
      image: 'https://via.placeholder.com/300x300?text=THE+BOYZ',
      parentId: boyGroup.id,
    },
  });

  const categoryTxt = await prisma.category.create({
    data: {
      name: 'TXT',
      slug: 'txt',
      description: 'TXT Products',
      image: 'https://via.placeholder.com/300x300?text=TXT',
      parentId: boyGroup.id,
    },
  });

  console.log('✅ Categories created (26 artists + 2 parent groups)');

  // Create Products for BTS
  await prisma.product.create({
    data: {
      name: 'BTS Map of the Soul Album',
      slug: 'bts-map-of-the-soul',
      description: 'BTS Map of the Soul Album - Limited Edition',
      price: 150000,
      stock: 50,
      imageUrl: 'https://via.placeholder.com/300x400?text=BTS+Album',
      categoryId: categoryBTS.id,
      isPromoted: true,
      rating: 4.8,
    },
  });

  await prisma.product.create({
    data: {
      name: 'BTS Official Lightstick',
      slug: 'bts-lightstick',
      description: 'BTS Official Lightstick - Purple Edition',
      price: 250000,
      stock: 100,
      imageUrl: 'https://via.placeholder.com/300x400?text=BTS+Lightstick',
      categoryId: categoryBTS.id,
      isPromoted: true,
      rating: 4.9,
    },
  });

  // Create Products for BLACKPINK
  await prisma.product.create({
    data: {
      name: 'BLACKPINK The Album',
      slug: 'blackpink-the-album',
      description: 'BLACKPINK The Album - Deluxe Edition',
      price: 180000,
      stock: 75,
      imageUrl: 'https://via.placeholder.com/300x400?text=BLACKPINK+Album',
      categoryId: categoryBlackpink.id,
      isPromoted: true,
      rating: 4.7,
    },
  });

  await prisma.product.create({
    data: {
      name: 'BLACKPINK Hoodies',
      slug: 'blackpink-hoodies',
      description: 'BLACKPINK Official Hoodies - Cotton',
      price: 350000,
      stock: 60,
      imageUrl: 'https://via.placeholder.com/300x400?text=BLACKPINK+Hoodies',
      categoryId: categoryBlackpink.id,
      isPromoted: false,
      rating: 4.6,
    },
  });

  // Create Products for TWICE
  await prisma.product.create({
    data: {
      name: 'TWICE Perfect World Album',
      slug: 'twice-perfect-world',
      description: 'TWICE Perfect World Album - K-version',
      price: 160000,
      stock: 80,
      imageUrl: 'https://via.placeholder.com/300x400?text=TWICE+Album',
      categoryId: categoryTwice.id,
      isPromoted: true,
      rating: 4.5,
    },
  });

  // Create Products for Stray Kids
  await prisma.product.create({
    data: {
      name: 'Stray Kids Oddinary Album',
      slug: 'stray-kids-oddinary',
      description: 'Stray Kids Oddinary Album - Standard Edition',
      price: 140000,
      stock: 90,
      imageUrl: 'https://via.placeholder.com/300x400?text=Stray+Kids+Album',
      categoryId: categoryStrayKids.id,
      isPromoted: false,
      rating: 4.4,
    },
  });

  console.log('✅ Products created');

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      userId: user2.id,
      totalPrice: 400000,
      status: 'completed',
    },
  });

  console.log('✅ Orders created');

  console.log(
    '✨ Seeding completed successfully!',
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
