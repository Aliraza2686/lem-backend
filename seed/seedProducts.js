import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modals/Product.js";

dotenv.config();

const products = [
  {
    id: 'salt',
    name: 'Himalayan Salt',
    category: 'Natural Mineral',
    origin: 'Khewra Salt Range, Punjab, Pakistan',
    desc: 'Premium Himalayan salt sourced directly from the Khewra Salt Range — the second largest salt mine in the world. Supplied for edible, decorative, therapeutic, and industrial applications, in block, granule, or powder form.',
    heroNote: 'Mined from a 600-million-year-old marine deposit',
    applications: ['Food & Culinary', 'Spa & Wellness', 'Decorative Lighting', 'Animal Nutrition', 'Industrial De-icing'],
    packaging: ['25kg / 50kg PP bags', 'Jumbo bags (1 ton)', 'Custom retail pouches', 'Private label cartons'],
    variants: [
      {
        key: 'pink',
        label: 'Pink Salt',
        swatch: '#e8a598',
        desc: 'The signature Himalayan variety, prized for its mineral-rich rosy hue and trace mineral content. Sourced from the Khewra Salt Range and supplied in block, granule, or powder form — our most requested grade for food, decorative, and wellness applications.',
        quality: 'Export Grade',
        highlights: [
          'Sourced From the Khewra Salt Range',
          'Available in Block, Granule, or Powder Form',
          'Suitable for Food, Décor & Wellness Applications',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276542/1665059526_la1h31.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276543/1665060094_r111bw.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276543/1665059969_bqjght.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276543/1665060201_beubio.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276544/1665060258_vs6nfs.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276544/1665060301_dbof3g.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1772276545/1665060380_becase.png' },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'bentonite',
    name: 'Bentonite',
    category: 'Industrial Mineral',
    origin: 'Khewra Range, Punjab, Pakistan',
    desc: 'One of our flagship export minerals — premium Bentonite sourced direct from the Himalayan Khewra mineral range, lab-tested for high silica and alumina content with ultra-low chloride and sulfur impurities. Supplied for drilling fluids, construction, foundry sand binding, and industrial manufacturing in crushed, powdered, or raw uncrushed lump form.',
    heroNote: 'High swelling capacity, low impurity content — direct from the Himalayan range',
    applications: ['Oil & Gas Drilling Mud', 'Foundry Sand Binder', 'Construction Sealants', 'Pet Litter Manufacturing', 'Wastewater Treatment'],
    packaging: ['25kg / 50kg PP bags', 'Jumbo bags (1 ton)', 'Bulk loose (truck/container)'],
    variants: [
      {
        key: 'brown',
        label: 'Bentonite',
        swatch: '#9c7a4f',
        desc: 'Our best-selling grade, sourced direct from the Himalayan Khewra range and independently lab-tested — among the highest-quality Bentonite we offer, widely used for foundry sand binding and civil construction sealing applications.',
        quality: 'Premium Grade — Direct From Himalayan Range',
        highlights: [
          'Sourced Direct From the Himalayan Khewra Range',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782131837/bentonite_vjpb7f.jpg' },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'limestone',
    name: 'Limestone',
    category: 'Industrial Mineral',
    origin: 'Punjab & Khyber Pakhtunkhwa, Pakistan',
    desc: 'Reliable limestone supply for construction aggregate, cement manufacturing, and industrial processing, available in calibrated lump, crushed, and powdered forms.',
    heroNote: 'Consistent CaCO₃ content for cement-grade use',
    applications: ['Cement Manufacturing', 'Construction Aggregate', 'Steel Flux', 'Soil Conditioning', 'Glass Manufacturing'],
    packaging: ['50kg PP bags', 'Jumbo bags (1 ton)', 'Bulk loose (truck/container)'],
    variants: [
      {
        key: 'white',
        label: 'White Limestone',
        swatch: '#eceae3',
        desc: 'A high-CaCO₃ grade limestone preferred for cement clinker production and whiteness-sensitive industrial uses, quarried from Pakistan\'s Punjab and Khyber Pakhtunkhwa limestone belts and supplied in calibrated lump, crushed, or powdered form to meet buyer specifications.',
        purity: '',
        highlights: [
          'Quarried From Punjab & Khyber Pakhtunkhwa',
          'High CaCO₃ Content for Cement-Grade Use',
          'Available in Lump, Crushed, or Powdered Form',
          'Custom Sizing to Buyer Specification',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782131637/limestone_t3mm0w.jpg' },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'antimony',
    name: 'Antimony',
    category: 'Metallic Mineral',
    origin: 'Balochistan, Pakistan',
    desc: 'Export-grade Antimony ore sourced from Pakistan\'s mineral-rich Balochistan deposits, supplied at 60%+ Sb content to international buyers for smelting and alloy production.',
    heroNote: 'Stable supply chain, 60%+ Sb content, with assay documentation',
    applications: ['Flame Retardants', 'Lead-Acid Battery Alloys', 'Semiconductors', 'Ammunition Alloys', 'Glass & Ceramics'],
    packaging: ['Jumbo bags (1 ton)', 'Bulk loose (truck/container)', 'Custom export crating'],
    variants: [
      {
        key: 'ore',
        label: 'Antimony Ore',
        swatch: '#6b6660',
        desc: 'Sourced from mineral-rich deposits in Balochistan, our Antimony Ore is supplied at 60% or higher Sb (antimony) content, suitable for smelting, alloying, and industrial processing applications.',
        purity: '60%+ Sb content',
        quality: 'Export Grade',
        highlights: [
          '60%+ Sb (Antimony) Content',
          'Sourced From Balochistan Mineral Deposits',
          'Suitable for Smelting & Alloy Production',
          'Assay Documentation Available on Request',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782126450/antimony2_xppsy9.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782126445/antimony_3_f7maly.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782126388/antimony_hucwrr.png' },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'nephrite-jade',
    name: 'Nephrite Jade',
    category: 'Natural Stone',
    origin: 'Gilgit-Baltistan, Pakistan',
    desc: 'Premium natural nephrite jade sourced from the mineral-rich mountains of northern Pakistan, available for decorative, gemstone, and collectible markets in rough and semi-polished form.',
    heroNote: 'Natural rough stone, graded by tone and translucency',
    applications: ['Gemstone Cutting', 'Decorative Carving', 'Collectible Specimens', 'Jewelry Manufacturing'],
    packaging: ['Protective crated boxes', 'Individually wrapped pieces', 'Bulk rough lots'],
    variants: [
      {
        key: 'green',
        label: 'Jade Nephrite',
        swatch: '#4f6b4a',
        desc: 'Naturally formed deep-green nephrite jade from the mineral-rich mountains of Gilgit-Baltistan, graded by tone and translucency and valued by carvers, collectors, and gemstone cutters for its density and workability.',
        purity: 'Gem-grade rough',
        highlights: [
          'Sourced From Gilgit-Baltistan, Northern Pakistan',
          'Graded By Tone & Translucency',
          'Supplied Rough or Semi-Polished',
          'Suitable for Carving, Cutting & Collecting',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782127324/nepherite_sjvbkz.jpg' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782126986/Nepherite_jade_2026-06-10_at_14.16.08_uo43cy.jpg' },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'white-quartz',
    name: 'White Quartz',
    category: 'Natural Mineral',
    origin: 'Khyber Pakhtunkhwa, Pakistan',
    desc: 'High-purity white quartz suitable for glass manufacturing, industrial silica applications, and decorative landscaping or surface use.',
    heroNote: 'High SiO₂ purity with low iron contamination',
    applications: ['Glass Manufacturing', 'Silica Sand Production', 'Decorative Aggregate', 'Ceramics & Refractories'],
    packaging: ['50kg PP bags', 'Jumbo bags (1 ton)', 'Bulk loose (truck/container)'],
    variants: [
      {
        key: 'lump',
        label: 'Quartz Lump',
        swatch: '#f4f3ef',
        desc: 'High-purity white quartz lumps as extracted, with low iron contamination, suitable for glass manufacturing, silica production, and industrial applications — supplied raw or crushed to the buyer\'s specified mesh size.',
        purity: 'White Quartz — 99.9774% SiO₂ purity',
        quality: 'High-Purity Export Grade',
        highlights: [
          '99.9774% SiO₂ Purity',
          'Low Iron Contamination',
          'Sourced From Khyber Pakhtunkhwa',
          'Supplied Raw or Crushed to Custom Mesh Size',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782130416/Screenshot_2026-06-22_at_5.13.06_PM_dswahr.png' },
          { src: 'https://res.cloudinary.com/dptmeakuy/video/upload/v1782130544/WhatsApp_Video_2026-06-10_at_14.14.52_bdt671.mp4', is_video: true },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'silica-sand',
    name: 'Silica Sand',
    category: 'Industrial Mineral',
    origin: 'Punjab & Sindh, Pakistan',
    desc: 'Silica sand sourced from Pakistan, laboratory-tested with purity reaching up to 99.6% SiO₂ in our premium white grade. Supplied in multiple grades for industrial applications, with custom mesh sizing, washing, grading, and bulk export packaging options.',
    heroNote: 'Laboratory-tested, up to 99.6% SiO₂ in our premium white grade',
    applications: [
      'Glass Manufacturing (Premium White Grade)',
      'Foundry Operations',
      'Water Filtration Media',
      'Ceramics Production',
      'Construction Materials',
    ],
    packaging: ['25kg / 50kg PP bags', 'Jumbo bags (1 ton)', 'Bulk loose (truck/container)'],
    variants: [
      {
        key: 'graded',
        label: 'White Silica Sand',
        swatch: '#d8c8aa',
        desc: 'High-purity white silica sand supported by chemical analysis showing exceptionally high silica content and very low impurity levels. Suitable for demanding industrial applications including glass manufacturing, foundry operations, ceramics, and filtration systems.',
        purity: 'More than 98% SiO₂',
        quality: 'Excellent Export Grade',
        highlights: [
          '98% Silicon Dioxide (SiO₂)',
          'Very Low Iron Content (Fe₂O₃: 0.018%)',
          'Low Calcium and Magnesium Impurities',
          'Consistent Graded Mesh Supply',
          'Suitable for Glass and Industrial Applications',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782125499/WhatsApp_Image_2026-06-12_at_12.02.39_kstkhx.jpg' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782125499/WhatsApp_Image_2026-06-12_at_12.02.39_1_swzjtd.jpg' },
        ],
      },
      {
        key: 'brown',
        label: 'Brown Silica Sand',
        swatch: '#b38b5d',
        desc: 'Naturally occurring brown silica sand with laboratory-tested silica content of 95.57% SiO₂. Suitable for foundry applications, construction materials, filtration media, and general industrial use.',
        purity: '95.57% SiO₂',
        quality: 'Industrial Export Grade',
        highlights: [
          'Laboratory Tested',
          '95.57% Silicon Dioxide (SiO₂)',
          'Available in Custom Mesh Sizes',
          'Suitable for Foundry and Construction Applications',
          'Bulk Export Supply Available',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782405937/WhatsApp_Image_2026-06-25_at_21.37.44_2_qgvnwr.jpg' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782405933/WhatsApp_Image_2026-06-25_at_21.37.43_mfhuoy.jpg' },
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782405939/WhatsApp_Image_2026-06-25_at_21.37.44_pyla5o.jpg' },
        ],
      },
    ],
    labReports: [],
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'Metallic Mineral',
    origin: 'Balochistan, Pakistan',
    desc: 'Copper ore and concentrate sourced from Pakistan mineral regions, supplied for smelting, refining, electrical, and industrial applications.',
    heroNote: 'High-value metallic mineral with export potential',
    applications: [
      'Copper Smelting',
      'Electrical Manufacturing',
      'Metal Alloy Production',
      'Industrial Fabrication',
      'Construction Materials',
    ],
    packaging: ['Jumbo bags (1 ton)', 'Bulk container shipment', 'Custom export packaging'],
    variants: [
      {
        key: 'ore',
        label: 'Copper Ore & Copper Concentrate',
        swatch: '#8b5a3c',
        desc: "Copper ore and concentrate sourced from Pakistan's mineral-rich Balochistan regions and supplied for smelting, refining, electrical, and industrial applications. Available in lump and concentrate forms with reliable quality for domestic and international buyers.",
        purity: '',
        highlights: [
          'Sourced From Balochistan, Pakistan',
          'Available in Lump or Concentrate Form',
          'Suitable for Smelting & Refining',
          'Domestic & International Supply',
        ],
        images: [
          { src: 'https://res.cloudinary.com/dptmeakuy/image/upload/v1782134297/copper_mo3uxi.png' },
        ],
      },
    ],
    labReports: [],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const product of products) {
      await Product.findOneAndUpdate({ id: product.id }, product, {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      });
      console.log(`Seeded: ${product.id}`);
    }

    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
