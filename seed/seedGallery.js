import mongoose from "mongoose";
import dotenv from "dotenv";
import Gallery from "../modals/Gallery.js";

dotenv.config();

// One-time import of the gallery that was hardcoded in lem-frontend src/pages/Galary.jsx.
// The images already live on Cloudinary — only the records are created, nothing is re-uploaded.
// The old component had no descriptions, only alt text, which becomes the title.
// Note: entries 3 and 4 intentionally point at the same asset (as they did on the site).
const images = [
  { title: "Workplace", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1749547014/368171d2-f64c-42c5-9e7d-a4dea0a4b8c0_lk6jrz.jpg" },
  { title: "Salt Candle Holder", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1755945558/Himalayan_Rock_Salt_Candle_Holder__is_available_s6uszh.jpg" },
  { title: "Himalayan Salt Warmer", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1755945557/Himalayan_Salt_-_Pink_Warmer__A_genuine_zomxzr.jpg" },
  { title: "Salt Table Lamp", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1755945557/Himalayan_Salt_-_Pink_Warmer__A_genuine_zomxzr.jpg" },
  { title: "Salt Lamp Variety", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1749546206/14e47b8d-93e8-447f-9f72-81d888aeeb0b_xqcfvo.jpg" },
  { title: "Natural Salt Lamp", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1749545146/About_this_item_Home_Decor__home_decor_items_such_egksqb.jpg" },
  { title: "Raw Pink Himalayan Salt", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1755945558/HSD_Pink_Himalayan_Salt_Rocks_1Kg___Food_Grade_xx7muw.jpg" },
  { title: "Himalayan Salt Mine", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1755945081/7ccf29e1-b647-4a76-8fb4-b24aa23b964f_jwhnxt.jpg" },
  { title: "Salt Bricks", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1768810414/received_867262264765142_atqi8q.jpg" },
  { title: "Edible Himalayan Salt", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1768810423/received_3613438468931285_xzarwb.jpg" },
  { title: "Salt Rock Presentation", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1768810416/received_1278297286201813_sn1b82.jpg" },
  { title: "Pink Himalayan Salt", imageUrl: "https://res.cloudinary.com/dptmeakuy/image/upload/v1768810414/received_803925301281025_zt56ty.jpg" },
];

// public_id = the path after /upload/, minus the optional version segment and file extension.
// e.g. .../image/upload/v1749547014/abc_lk6jrz.jpg -> "abc_lk6jrz"
const publicIdFromUrl = (url) => {
  const match = url.match(/\/upload\/(?:[^/]+,[^/]*\/)*(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i);
  if (!match) throw new Error(`Could not extract public_id from ${url}`);
  return decodeURIComponent(match[1]);
};

const seedGallery = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Gallery.countDocuments();
    if (existing > 0) {
      console.log(`Gallery already has ${existing} records — skipping so nothing is duplicated.`);
      process.exit();
    }

    const docs = images.map((img, index) => ({
      title: img.title,
      description: "",
      imageUrl: img.imageUrl,
      imagePublicId: publicIdFromUrl(img.imageUrl),
      displayOrder: index,
    }));

    const inserted = await Gallery.insertMany(docs);
    console.log(`Inserted ${inserted.length} gallery records (expected ${images.length})`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedGallery();
