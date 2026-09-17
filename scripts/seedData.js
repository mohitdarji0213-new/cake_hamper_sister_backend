/*
 * 🌱 Seed Data — Cake Hamper Sisters
 * Categories + Products + Offers add karta hai (Pexels ki cake images -> Cloudinary upload)
 * Run from /backend:  node scripts/seedData.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Offer = require('../models/Offer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const uploaded = {};
async function uploadImage(url, name) {
  if (uploaded[url]) return uploaded[url];
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`download ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const dataUri = `data:image/jpeg;base64,${buf.toString('base64')}`;
    const up = await cloudinary.uploader.upload(dataUri, {
      folder: 'cake-hamper-sisters',
      public_id: slugify(name, { lower: true }),
      overwrite: true,
    });
    uploaded[url] = up.secure_url;
    console.log(`   OK Cloudinary: ${name}`);
  } catch (e) {
    console.log(`   WARN Cloudinary skip (${String(e.message).slice(0, 40)}) -> direct URL: ${name}`);
    uploaded[url] = url;
  }
  return uploaded[url];
}

const FLAVORS = [
  { name: 'Chocolate',    icon: '🍫', desc: 'Rich belgian chocolate cakes jo har kisi ko pasand aayein', image: pexels(1638289), order: 1 },
  { name: 'Vanilla',      icon: '🍦', desc: 'Soft creamy vanilla cakes classic aur timeless',              image: pexels(140831),  order: 2 },
  { name: 'Red Velvet',   icon: '❤️', desc: 'Velvety red layers with cream cheese frosting',              image: pexels(985015),   order: 3 },
  { name: 'Butterscotch', icon: '🧈', desc: 'Caramelized butterscotch crunch cakes',                     image: pexels(264940),   order: 4 },
  { name: 'Black Forest', icon: '🍒', desc: 'Cherry-topped chocolate cream classic',                         image: pexels(531880),   order: 5 },
  { name: 'Pineapple',    icon: '🍍', desc: 'Juicy pineapple cream cakes',                                 image: pexels(357573),   order: 6 },
];

const DESIGNS = [
  { name: 'Birthday Cakes', icon: '🎂', desc: 'Birthday par candles, sprinkles aur dher saari khushi', image: pexels(3952063), order: 1 },
  { name: 'Wedding Cakes',  icon: '💍', desc: 'Royal multi-tier wedding cakes',                          image: pexels(1126359), order: 2 },
  { name: 'Photo Cakes',    icon: '🖼️', desc: 'Apni photo ke saath personalised cake',                     image: pexels(1026253), order: 3 },
  { name: 'Theme Cakes',    icon: '🎉', desc: 'Cartoon se lekar designer themes tak',                      image: pexels(941861),  order: 4 },
  { name: 'Cupcakes',       icon: '🧁', desc: 'Mini cupcakes parties ki jaan',                               image: pexels(5743280), order: 5 },
  { name: 'Pastries',       icon: '🍰', desc: 'Assorted pastries box',                                    image: pexels(5737911), order: 6 },
];

const PRODUCTS = [
  { name: 'Belgian Chocolate Truffle Cake',  desc: 'Rich belgian chocolate truffle cake with layered ganache. Birthday ya kisi bhi celebration ke liye perfect!', price: 749,  originalPrice: 999,  cat: 'Chocolate',    tags: ['chocolate', 'truffle', 'eggless'], image: pexels(1638289), isNew: true,  isFeatured: true,  stock: 15, rating: 4.8, numReviews: 42 },
  { name: 'Belgian Chocolate Fudge Cake',     desc: 'Double-layer chocolate fudge cake with silky chocolate fudge frosting. Chocoholics ka favourite!',                    price: 899,  originalPrice: 1199, cat: 'Chocolate',    tags: ['chocolate', 'fudge'],             image: pexels(2915283), isNew: false, isFeatured: true,  stock: 10, rating: 4.9, numReviews: 56 },
  { name: 'Royal White Wedding Cake',          desc: 'Elegant white royal wedding cake perfect for apne khaas din. Custom size bhi available hai.',                    price: 2499, originalPrice: 2999, cat: 'Wedding Cakes', tags: ['wedding', '2-tier', 'royal'],     image: pexels(1126359), isNew: false, isFeatured: true,  stock: 4,  rating: 5.0, numReviews: 18 },
  { name: 'Fresh Strawberry Gateaux',          desc: 'Soft vanilla sponge, fresh strawberry cream aur juicy strawberries summers ki perfect sweet treat.',            price: 849,  originalPrice: 1099, cat: 'Vanilla',      tags: ['strawberry', 'vanilla', 'cream'], image: pexels(140831),  isNew: true,  isFeatured: false, stock: 12, rating: 4.6, numReviews: 23 },
  { name: 'Chocolate Drip Birthday Cake',      desc: 'Party ka hero! Chocolate ganache drip ke saath birthday cake. Birthday jaldi bharo.',                         price: 999,  originalPrice: 1299, cat: 'Birthday Cakes',tags: ['birthday', 'chocolate-drip'],    image: pexels(3952063), isNew: true,  isFeatured: true,  stock: 16, rating: 4.7, numReviews: 35 },
  { name: 'Photo Cake Hamper Special',         desc: 'Apni ya apno ki favourite photo ke saath personalised photo cake hamesha yaad rahega yeh gift.',                 price: 1299, originalPrice: 1599, cat: 'Photo Cakes',   tags: ['photo', 'custom', 'birthday'],   image: pexels(1026253), isNew: false, isFeatured: true,  stock: 8,  rating: 4.5, numReviews: 29 },
  { name: 'Red Velvet Cream Cheese Cake',      desc: 'Red velvet layers with soft cream cheese frosting rich aur smooth.',                                         price: 1099, originalPrice: 1399, cat: 'Red Velvet',    tags: ['red-velvet', 'cream-cheese'],     image: pexels(985015),  isNew: false, isFeatured: true,  stock: 11, rating: 4.9, numReviews: 48 },
  { name: 'Black Forest Cherry Surprise',      desc: 'Chocolate sponge, fresh cream aur cherry topping classic Black Forest jo kabhi faila nahi hota.',                  price: 949,  originalPrice: 1199, cat: 'Black Forest',  tags: ['black-forest', 'cherry', 'chocolate'], image: pexels(531880), isNew: true,  isFeatured: false, stock: 9,  rating: 4.7, numReviews: 31 },
  { name: 'Butterscotch Crunch Caramel Cake',  desc: 'Butterscotch crunch aur caramel drizzle ke saath mithaas ka naya level.',                                      price: 849,  originalPrice: 1099, cat: 'Butterscotch',  tags: ['butterscotch', 'caramel', 'crunch'], image: pexels(264940), isNew: true,  isFeatured: false, stock: 14, rating: 4.4, numReviews: 17 },
  { name: 'Pineapple Honey Layer Cake',        desc: 'Juicy pineapple chunks, honey glaze aur fluffy cream layers.',                                                 price: 799,  originalPrice: 999,  cat: 'Pineapple',     tags: ['pineapple', 'honey', 'cream'],   image: pexels(357573),  isNew: false, isFeatured: false, stock: 13, rating: 4.3, numReviews: 15 },
  { name: 'Designer Theme Cake',               desc: 'Cartoon character, floral ya designer theme batao bas, hum bana denge bilkul waisa!',                           price: 1599, originalPrice: 1999, cat: 'Theme Cakes',   tags: ['theme', 'designer', 'cartoon'],   image: pexels(941861),  isNew: true,  isFeatured: false, stock: 6,  rating: 4.6, numReviews: 12 },
  { name: 'Chocolate Cupcake Party Box',       desc: '6 delicious chocolate cupcakes, ek stylish box mein party hogi kamaal ki!',                                    price: 599,  originalPrice: 749,  cat: 'Cupcakes',      tags: ['cupcake', 'party', 'box'],        image: pexels(5743280), isNew: true,  isFeatured: false, stock: 20, rating: 4.5, numReviews: 26 },
  { name: 'Assorted Pastry Box (12 pcs)',      desc: 'Chocolate, vanilla, strawberry 12 assorted pastries ek hi box mein. Party / office ke liye best.',              price: 449,  originalPrice: 599,  cat: 'Pastries',      tags: ['pastry', 'assorted', 'box'],      image: pexels(5737911), isNew: false, isFeatured: true,  stock: 25, rating: 4.6, numReviews: 22 },
  { name: 'Cheesecake Delight Slice',          desc: 'Creamy New York style cheesecake slice coffee ke saath perfect combo.',                                          price: 559,  originalPrice: 699,  cat: 'Chocolate',    tags: ['cheesecake', 'chocolate'],        image: pexels(3731613), isNew: true,  isFeatured: false, stock: 10, rating: 4.7, numReviews: 19 },
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected!');

  const catMap = {};

  for (const [type, list] of [['flavor', FLAVORS], ['design', DESIGNS]]) {
    for (const c of list) {
      const slug = slugify(c.name, { lower: true });
      const image = await uploadImage(c.image, c.name);
      await Category.findOneAndUpdate(
        { slug },
        { name: c.name, slug, description: c.desc, icon: c.icon, image, type, order: c.order, isActive: true },
        { upsert: true, new: true }
      );
      catMap[c.name] = slug;
      console.log(`CAT ${type}: ${c.name}`);
    }
  }

  const catDocs = {};
  for (const c of await Category.find()) catDocs[c.name] = c._id;

  for (const p of PRODUCTS) {
    const image = await uploadImage(p.image, p.name);
    const slug = slugify(p.name, { lower: true });
    await Product.findOneAndUpdate(
      { slug },
      {
        name: p.name, slug, description: p.desc,
        price: p.price, originalPrice: p.originalPrice,
        images: [image], category: catDocs[p.cat], tags: p.tags,
        stock: p.stock, isNew: p.isNew, isFeatured: p.isFeatured, isActive: true,
        rating: p.rating, numReviews: p.numReviews,
      },
      { upsert: true, new: true }
    );
    console.log(`PRODUCT: ${p.name} - ${p.price}`);
  }

  const today = new Date();
  // User request: SAARE offers active rahein — start past mein, end 1 saal aage
  const offerStart = addDays(today, -30);
  const offerEnd = addDays(today, 365);
  const offers = [
    { title: 'Diwali Dhamaka Sale', description: 'Deepawali par saare cakes par 25% tak ki dhamakedar chhut! Apne pariwar ko cake ka tohfa dijiye.', occasion: 'diwali', discountPercent: 25, code: 'DIWALI25', image: pexels(3026804), validFrom: offerStart, validTill: offerEnd },
    { title: 'Birthday Boss Special', description: 'Birthday par jitna jashn, utni chhut 20% OFF sirf is hafte. Chocolate drip cakes se party shuru!', occasion: 'birthday', discountPercent: 20, code: 'BIRTHDAY20', image: pexels(376464), validFrom: offerStart, validTill: offerEnd },
    { title: 'New Year Fresh Start', description: 'Naye saal ki shuruaat meethi karein 30% OFF hamare special cakes par.', occasion: 'new_year', discountPercent: 30, code: 'NEWYEAR30', image: pexels(4705556), validFrom: offerStart, validTill: offerEnd },
    { title: 'Chocolate Lovers Weekend', description: 'Weekend hai toh chocolate hai! Har chocolate cake par 15% chhut.', occasion: 'other', discountPercent: 15, code: 'CHOCO15', image: '', validFrom: offerStart, validTill: offerEnd },
    { title: 'Valentine Couple Deal', description: 'Pyaar ka izhaar cake se karein couple cakes par 10% OFF.', occasion: 'valentine', discountPercent: 10, code: 'LOVE10', image: '', validFrom: offerStart, validTill: offerEnd },
    { title: 'Christmas Treat Offer', description: 'Christmas par hamare special winter cakes par 20% off.', occasion: 'christmas', discountPercent: 20, code: 'XMAS20', image: pexels(5737911), validFrom: offerStart, validTill: offerEnd },
  ];

  for (const o of offers) {
    let image = o.image;
    if (image) image = await uploadImage(image, o.title);
    await Offer.findOneAndUpdate(
      { title: o.title },
      {
        title: o.title, description: o.description, occasion: o.occasion,
        discountPercent: o.discountPercent, code: o.code, image,
        validFrom: o.validFrom, validTill: o.validTill, isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log(`OFFER: ${o.title} (${o.validFrom.toISOString().slice(0, 10)} -> ${o.validTill.toISOString().slice(0, 10)})`);
  }

  const counts = {
    categories: await Category.countDocuments(),
    products: await Product.countDocuments(),
    offers: await Offer.countDocuments(),
  };
  console.log('Seed complete:', JSON.stringify(counts));
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error('SEED ERROR:', e.message);
  process.exit(1);
});
