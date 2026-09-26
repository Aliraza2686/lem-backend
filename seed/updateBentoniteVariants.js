import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary, { deleteFromCloudinary } from "../config/cloudinary.js";
import Product from "../modals/Product.js";

dotenv.config();

// Real, freely-usable stock photos (Pexels), distinct per variant.
const VARIANT_SOURCE_IMAGES = {
  "white-oil-grade": [
    "https://images.pexels.com/photos/18560234/pexels-photo-18560234.jpeg",
    "https://images.pexels.com/photos/7222324/pexels-photo-7222324.jpeg",
  ],
  "white-water-grade": [
    "https://images.pexels.com/photos/21047659/pexels-photo-21047659.jpeg",
    "https://images.pexels.com/photos/17399217/pexels-photo-17399217.jpeg",
  ],
  "brown-construction": [
    "https://images.pexels.com/photos/29470001/pexels-photo-29470001.jpeg",
    "https://images.pexels.com/photos/6104931/pexels-photo-6104931.jpeg",
  ],
};

const VARIANTS = [
  {
    key: "white-oil-grade",
    label: "White Bentonite (Oil Grade)",
    swatch: "#e9e4d8",
    desc:
      "Sodium-activated white bentonite refined specifically for oil and gas drilling fluids, where it functions as the primary viscosifier and filtration-control agent in water-based mud systems. At typical dosages of 20–35 kg per cubic metre of mud, it builds the plastic viscosity and yield point needed to lift cuttings out of the wellbore while depositing a thin, low-permeability filter cake that limits fluid loss into the formation. We process this grade to API 13A-comparable specifications — high montmorillonite content, controlled moisture, and low grit — because inconsistent yield forces a rig to burn through more product per metre drilled, which is the real cost that matters to a drilling contractor, not the price per bag. It also contributes directly to wellbore stabilization in sloughing shale sections, where a poorly performing bentonite can mean stuck pipe and an expensive fishing job.",
    purity: "Montmorillonite content 85–90%, wet yield ≥ 16.5 m³/tonne",
    quality: "API 13A-Comparable Oil Grade",
    highlights: [
      "Sodium-Activated for High Yield & Viscosity",
      "API Fluid Loss ≤ 15 ml/30 min",
      "-200 Mesh (74 Micron), 90%+ Passing",
      "Low Sand & Grit Content for Clean Mud Systems",
    ],
    images: [],
  },
  {
    key: "white-water-grade",
    label: "White Bentonite (Water Grade)",
    swatch: "#f2ede0",
    desc:
      "This is the grade most water well drillers actually need, and it costs less than oil-grade material because it doesn't carry the same processing burden. Water well drilling rarely deals with the downhole pressures, temperatures, or hydrocarbon-bearing formations that oil-grade bentonite is engineered against, so viscosity and API filtration tolerances can be relaxed without hurting hole stability. The same swelling clay is also used downstream of the wellbore as a coagulant aid in water treatment and clarification, where its negatively charged platelets bind suspended fines and turbidity out of raw water before filtration. Because the end use often touches potable water systems, we screen this grade for heavy-metal content on request; for most municipal and agricultural water-well contracts, water-grade bentonite is the more sensible economic choice, and stepping up to oil-grade material here is usually just paying for performance nobody is using.",
    purity: "Montmorillonite content 75–85%, moisture ≤ 12%",
    quality: "Water Well & Treatment Grade",
    highlights: [
      "Cost-Effective Alternative to Oil-Grade Bentonite",
      "Suitable for Potable Water & Clarification Use",
      "-100 to -200 Mesh Available",
      "Heavy-Metal Screening Available on Request",
    ],
    images: [],
  },
  {
    key: "brown-construction",
    label: "Brown Bentonite (Construction/Piling)",
    swatch: "#9c7a4f",
    desc:
      "Our highest-volume grade and the workhorse behind most of our export tonnage — a general-purpose calcium-sodium bentonite used to support bored pile excavations, diaphragm walls, and slurry trench cutoff walls on civil construction sites. Mixed at 4–6% by weight of water, it produces a Marsh funnel viscosity of roughly 32–50 seconds and forms the filter cake that keeps a borehole open through loose or water-bearing ground long enough to place reinforcement and pour concrete. It doesn't need the tight filtration-control tolerances of an oil-grade product or the purity screening of a water-grade one, which is exactly why it's priced for high-volume site consumption rather than specialty use. If your project is a piling rig or a diaphragm wall trench rather than a wellbore, this is the grade to spec — buying oil-grade material for a construction slurry pit is over-engineering the mix design.",
    purity: "Montmorillonite content 65–75%",
    quality: "General-Purpose Construction Grade",
    highlights: [
      "Supports Bored Piling, Diaphragm Walls & Slurry Trenches",
      "Marsh Funnel Viscosity ~32–50 sec/quart at Working Dosage",
      "Highest-Volume, Most Economical Grade",
      "Sourced Direct From the Himalayan Khewra Range",
    ],
    images: [],
  },
];

const uploadVariantImages = async () => {
  for (const variant of VARIANTS) {
    const sources = VARIANT_SOURCE_IMAGES[variant.key];
    for (const url of sources) {
      const result = await cloudinary.uploader.upload(url, {
        folder: `products/bentonite/${variant.key}`,
      });
      variant.images.push({ src: result.secure_url, publicId: result.public_id });
      console.log(`Uploaded ${variant.key}: ${result.secure_url}`);
    }
  }
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const product = await Product.findOne({ id: "bentonite" });
    if (!product) {
      throw new Error("Bentonite product not found — run seedProducts.js first");
    }

    const oldPublicIds = (product.variants || []).flatMap((v) =>
      (v.images || []).map((img) => img.publicId).filter(Boolean)
    );

    await uploadVariantImages();

    product.name = "Bentonite";
    product.category = "Industrial Mineral";
    product.origin = "Khewra Range, Punjab, Pakistan";
    product.desc =
      "Bentonite sourced from Pakistan's Khewra mineral range, processed into three distinct grades so buyers aren't paying for specifications they don't need: a sodium-activated oil grade for drilling fluid viscosity and filtration control, a lighter-processed water grade for water well drilling and treatment, and a general-purpose brown grade for construction piling and diaphragm wall slurry. Each grade is lab-tested and supplied in crushed, powdered, or raw lump form to match the buyer's mixing setup.";
    product.heroNote =
      "Now available in three grades — oil, water, and construction — each processed to match its actual downhole or site demands";
    product.applications = [
      "Oil & Gas Drilling Mud (Oil Grade)",
      "Water Well Drilling & Water Treatment (Water Grade)",
      "Bored Piling & Diaphragm Walls (Construction Grade)",
      "Foundry Sand Binder",
      "Wastewater Treatment",
    ];
    product.packaging = ["25kg / 50kg PP bags", "Jumbo bags (1 ton)", "Bulk loose (truck/container)"];
    product.variants = VARIANTS;

    await product.save();
    console.log("Bentonite product updated with 3 variants");

    const newPublicIds = new Set(
      product.variants.flatMap((v) => (v.images || []).map((img) => img.publicId).filter(Boolean))
    );
    const orphaned = oldPublicIds.filter((pid) => !newPublicIds.has(pid));
    await Promise.all(orphaned.map((pid) => deleteFromCloudinary(pid).catch(() => {})));
    console.log(`Cleaned up ${orphaned.length} orphaned Cloudinary asset(s)`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

run();
