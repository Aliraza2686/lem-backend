import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Article from "../modals/Article.js";
import User from "../modals/User.js";

dotenv.config();

const ARTICLES = [
  {
    title:
      "White Bentonite: Oil Grade vs. Water Grade — What's the Difference and Which Do You Need",
    excerpt:
      "Oil-grade and water-grade white bentonite share a mineral origin and not much else. Here's how the processing, specs, and cost actually differ — and which one your project needs.",
    category: "Drilling Fluids",
    tags: ["bentonite", "oil grade bentonite", "water grade bentonite", "drilling fluid", "water well drilling"],
    seo: {
      metaTitle: "Oil Grade vs. Water Grade Bentonite: Which Do You Need? | Lumina Earth Minerals",
      metaDescription:
        "A working guide to oil-grade vs. water-grade white bentonite — viscosity, API fluid loss, mesh size, and cost — from a bentonite oil grade supplier and water grade bentonite exporter.",
      keywords: ["bentonite oil grade supplier", "water grade bentonite export", "drilling fluid bentonite", "water well drilling bentonite"],
    },
    isFeatured: true,
    images: {
      cover: {
        url: "https://images.pexels.com/photos/21047659/pexels-photo-21047659.jpeg",
        folder: "articles/bentonite-grades",
      },
      gallery1: {
        url: "https://images.pexels.com/photos/18560234/pexels-photo-18560234.jpeg",
        folder: "articles/bentonite-grades",
        caption: "An oil field drilling site among barren rock formations, where oil-grade bentonite mud does its work downhole",
      },
      gallery2: {
        url: "https://images.pexels.com/photos/7222324/pexels-photo-7222324.jpeg",
        folder: "articles/bentonite-grades",
        caption: "Close-up of fine white bentonite clay powder",
      },
      gallery3: {
        url: "https://images.pexels.com/photos/17399217/pexels-photo-17399217.jpeg",
        folder: "articles/bentonite-grades",
        caption: "A traditional water well in a desert setting, the kind of shallow drilling water-grade bentonite is built for",
      },
    },
    buildContent: (images) => `
<p>A drilling contractor working a shale play in Sindh and a village water-board engineer sinking a hand-pump borehole in rural Punjab both order "bentonite" by the ton. They are not buying the same material, and treating the two as interchangeable is exactly how a mud program runs over budget on one end, or a water well loses circulation on the other. White bentonite splits cleanly into two commercial grades — oil grade and water grade — and the difference between them isn't a marketing label. It's processing intensity, montmorillonite content, and how tightly the viscosity and fluid-loss properties are held, and it shows up the moment either grade goes to work.</p>

<img src="${images.cover.url}" alt="Water well drilling rig at work" />

<h2>What the Two Grades Have in Common</h2>
<p>Both start life as the same mineral: montmorillonite, a swelling clay formed from weathered volcanic ash, mined and beneficiated from deposits including Pakistan's Khewra mineral range. Both are sodium-activated to some degree, since sodium bentonite disperses and swells in water far more aggressively than the calcium-rich variety, and that swelling is what makes either grade useful in a fluid system in the first place. Past that shared starting point, though, the two products are engineered — deliberately, not accidentally — toward very different jobs, and the processing steps that separate them (soda-ash dosage, drying time, milling fineness, filtration testing) are exactly where the cost difference comes from.</p>

<h3>Calcium vs. Sodium Bentonite</h3>
<p>Not all raw bentonite ore comes out of the ground naturally sodium-rich. A good share of the world's supply, including much of what's mined in Pakistan, is calcium-dominant and needs to be treated with soda ash (sodium carbonate) during processing to exchange calcium ions for sodium ions on the clay surface — a step generally called sodium activation. Properly activated calcium bentonite can perform close to a naturally sodium-rich deposit, but activation quality varies considerably between processors, and it's one of the first things worth asking about when a supplier's numbers look better than the price should allow.</p>

<h2>White Bentonite, Oil Grade: Built for the Wellbore</h2>
<p>Oil-grade bentonite exists to do three things inside a water-based drilling mud: build viscosity, control filtration, and stabilize the wellbore wall. None of those jobs is optional on a rig, and none of them tolerates an inconsistent raw material.</p>

<h3>Viscosity and Yield</h3>
<p>A mud engineer cares about yield — how much usable, in-spec mud a tonne of bentonite produces — more than almost any other line on the spec sheet. At a typical treatment rate of 20 to 35 kilograms per cubic metre of mud, a properly processed oil-grade bentonite should deliver a wet yield of roughly 16.5 cubic metres per tonne or better, building enough plastic viscosity and yield point to lift drill cuttings out of the hole without turning the mud into something the pumps can't move. Inconsistent yield doesn't just waste product; it forces constant remixing at the shale shaker, which is time a rig crew never gets back.</p>

<h3>Filtration Control</h3>
<p>Under an API fluid-loss test, a well-processed oil-grade bentonite should hold filtrate loss to around 15 millilitres or less over 30 minutes, laying down a thin, tough filter cake against the borehole wall rather than a thick, crumbly one. That thin cake matters twice over: it limits how much fluid invades the formation, protecting reservoir permeability near the wellbore, and it cuts the torque and drag a drill string experiences dragging past a rough, over-built cake.</p>

<h3>Wellbore Stabilization</h3>
<p>In sloughing shale sections — the kind that swell, slake, or spall into the hole on contact with the wrong fluid — a high-quality sodium bentonite mud provides the hydrostatic support and filter-cake sealing that keeps the hole gauge intact. Get this wrong with a weak or contaminated bentonite and the result is stuck pipe, a fishing job, and non-productive time that dwarfs whatever was saved by buying a cheaper grade.</p>

<img src="${images.gallery1.url}" alt="${images.gallery1.caption}" />

<h2>White Bentonite, Water Grade: Built for the Well, Not the Reservoir</h2>
<p>Water-grade bentonite isn't a watered-down oil-grade product — it's a different product, deliberately processed to a lighter specification because the job it does doesn't need API-tier performance.</p>

<h3>Water Well Drilling</h3>
<p>A water well rarely drills through hydrocarbon-bearing shale under high downhole pressure and temperature. It drills through shallower, unconsolidated overburden and aquifer sands, where bentonite's job is simpler: build enough viscosity to carry cuttings and hold the borehole open until casing goes in. A water-grade product running 75 to 85 percent montmorillonite content at -100 to -200 mesh comfortably does that job at a meaningfully lower cost per tonne than an API-spec material.</p>

<h3>Water Treatment and Clarification</h3>
<p>Downstream of drilling, the same clay chemistry gets used again — as a coagulant aid in water treatment plants, where bentonite's negatively charged platelets bind suspended fine particles and turbidity out of raw water ahead of filtration. Municipal and agricultural water treatment operations buy this grade specifically for that clarifying action, with no interest in drilling-fluid rheology at all.</p>

<h3>Potable Water Considerations</h3>
<p>Because so much of this grade's end use eventually touches a potable water system — either the well itself or the treatment plant downstream — heavy-metal content (arsenic, lead, and similar trace contaminants naturally present in raw clay deposits) matters more here than it does in an oil-grade product headed for a mud pit. We screen water-grade bentonite for heavy metals on request, a check that's largely irrelevant to an oil-grade buyer but effectively non-negotiable for a water utility.</p>

<img src="${images.gallery2.url}" alt="${images.gallery2.caption}" />

<h2>What Actually Separates the Two Grades</h2>
<table>
<tr><th>Property</th><th>Oil Grade</th><th>Water Grade</th></tr>
<tr><td>Montmorillonite content</td><td>85–90%</td><td>75–85%</td></tr>
<tr><td>API fluid loss</td><td>≤ 15 ml / 30 min</td><td>Not typically specified</td></tr>
<tr><td>Mesh size</td><td>-200 mesh, 90%+ passing</td><td>-100 to -200 mesh</td></tr>
<tr><td>Heavy-metal screening</td><td>Rarely requested</td><td>Available on request</td></tr>
<tr><td>Relative unit cost</td><td>Higher</td><td>Lower</td></tr>
</table>
<p>None of these differences are cosmetic. Each one reflects a real processing cost — more intensive sodium activation, tighter particle-size control, more rigorous lab testing — that a mud engineer on an oil rig is willing to pay for and a water-well contractor usually shouldn't have to.</p>

<h2>Which Grade Do You Actually Need?</h2>
<p>I'll commit to an actual recommendation here instead of hedging: for water well drilling, municipal water treatment, and irrigation borehole work, water-grade bentonite is the right economic choice in the overwhelming majority of cases. Stepping up to oil-grade material for a water well doesn't buy meaningfully better hole stability — the ground conditions simply don't demand it — it just buys a bigger invoice. The one real exception is horizontal directional drilling for utility or pipeline installation, where higher pressures and longer bore lengths can justify the tighter filtration control of an oil-grade or HDD-specific product.</p>
<p>On the other side, there's no version of this decision where an oil and gas operator should specify water-grade material to save money. API fluid-loss and yield tolerances exist because the cost of a stuck string or a damaged reservoir interval runs into the tens of thousands of dollars per day of rig time — against which the price gap between grades is trivial.</p>

<h2>Sourcing Bentonite for Export</h2>
<p>We process both grades from the same Khewra-range deposits, which keeps mineralogy consistent across a shipment while activation and screening are adjusted to the buyer's grade. As a bentonite oil grade supplier working with drilling contractors and mud engineers, we run each export lot through montmorillonite content, yield, and API fluid-loss testing before bagging, with lab documentation shipped alongside the cargo. For water grade bentonite export orders headed to municipal contractors or well-drilling operations, we run the lighter water-grade specification and heavy-metal screening instead, since that's the number a utility engineer actually needs on the certificate — not an API filtration result. Both grades move out through Karachi Port and Port Qasim in 25kg and 50kg PP bags, one-tonne jumbo bags, or bulk loose container and truck shipment, depending on the buyer's handling setup at the receiving end. Typical export orders run anywhere from a single 20-foot container — roughly 24 to 26 tonnes bagged — up to multi-thousand-tonne term contracts for larger drilling contractors, and lead time from a confirmed order to vessel loading generally runs three to five weeks depending on grade, packaging, and current mine output.</p>

<img src="${images.gallery3.url}" alt="${images.gallery3.caption}" />

<h2>Getting the Spec Sheet Right the First Time</h2>
<p>The most common mistake we see from first-time buyers is ordering by product name instead of by application. "Bentonite" isn't a specification; montmorillonite content, mesh size, API fluid-loss result, and, for water-grade orders, heavy-metal screening are. Tell us the application — a producing well, a water well, a treatment plant — and the correct grade and testing package follow from that, rather than the other way around.</p>

<h2>Conclusion</h2>
<p>Oil-grade and water-grade white bentonite share a mineral origin and not much else in terms of how they're specified, tested, or priced. Get the grade wrong on a drilling rig and you risk fluid loss, stuck pipe, and non-productive time; get it wrong on a water well and you're simply overpaying for tolerances the job never needed. Match the grade to the application, verify the numbers on the certificate rather than the label on the bag, and both jobs go the way they're supposed to.</p>
`.trim(),
  },
  {
    title: "Bauxite: What It Is, How It's Mined, and Why Industries Depend On It",
    excerpt:
      "Bauxite is the ore behind every aluminum can and airframe — but most of what's mined never reaches a smelter at all. Here's the mineralogy, the mining, and why grade matters more than the label.",
    category: "Industrial Minerals",
    tags: ["bauxite", "aluminum ore", "bauxite mining", "cement industry", "refractory", "Pakistan minerals"],
    seo: {
      metaTitle: "Bauxite: Mining, Processing & Industrial Uses | Lumina Earth Minerals",
      metaDescription:
        "How bauxite is mined and processed, why not all deposits are metallurgical grade, and what to check before buying from a bauxite exporter Pakistan or any bauxite ore supplier.",
      keywords: ["bauxite exporter Pakistan", "bauxite ore supplier", "bauxite mining", "aluminum ore Pakistan"],
    },
    isFeatured: false,
    images: {
      cover: {
        url: "https://images.pexels.com/photos/36705758/pexels-photo-36705758.jpeg",
        folder: "articles/bauxite",
      },
      gallery1: {
        url: "https://images.pexels.com/photos/31133222/pexels-photo-31133222.jpeg",
        folder: "articles/bauxite",
        caption: "A deserted industrial mining site in rugged terrain",
      },
      gallery2: {
        url: "https://images.pexels.com/photos/34637954/pexels-photo-34637954.jpeg",
        folder: "articles/bauxite",
        caption: "Close-up of natural red gravel and ore fragments",
      },
      gallery3: {
        url: "https://images.pexels.com/photos/93106/pexels-photo-93106.jpeg",
        folder: "articles/bauxite",
        caption: "A cargo ship loaded with containers at a commercial seaport",
      },
    },
    buildContent: (images) => `
<p>Bauxite doesn't look like much sitting in a stockpile — a rust-red, pea-to-marble-sized pisolitic rock that could pass for road gravel if you didn't know better. But it's the ore behind virtually every aluminum can, airframe panel, and extruded window frame on the planet, and almost nobody using those products could tell you where the metal actually came from. It came from bauxite, and the path from red rock to finished metal runs through one of the more energy-intensive supply chains in industrial minerals.</p>

<img src="${images.cover.url}" alt="Red earth bauxite quarry landscape" />

<h2>What Is Bauxite?</h2>
<p>Bauxite isn't a single mineral — it's a rock made mainly of aluminum hydroxide minerals (gibbsite, and to a lesser extent boehmite and diaspore) mixed with iron oxides, titanium dioxide, and clay minerals like kaolinite. It forms through intense chemical weathering of aluminosilicate rocks in tropical and subtropical climates, a process called laterization, in which heavy rainfall leaches out the more soluble silica and leaves behind an aluminum- and iron-enriched residue near the surface. That's why the world's largest deposits sit in a belt of countries with the right weathering history — Guinea, Australia, Brazil, Jamaica, Vietnam, India — rather than being scattered evenly across the globe.</p>

<h3>Gibbsitic vs. Boehmitic Ore</h3>
<p>The mineralogy matters more than most buyers realize. Gibbsitic bauxite, common in Guinea, Jamaica, and Australia's Darling Range, digests at relatively low temperature and pressure in a refinery and is the cheapest to process. Boehmitic and diasporic bauxite, more common in parts of China and the Mediterranean, need higher-temperature, higher-pressure digestion, which raises the energy cost of refining even when the alumina content on paper looks comparable.</p>

<h2>How Bauxite Is Mined</h2>
<p>Because most commercial deposits sit close to the surface — often as a blanket-like layer only a few metres thick under a thin covering of topsoil — the overwhelming majority of the world's bauxite is extracted by open-pit or strip mining rather than underground methods. Topsoil and overburden are stripped and stockpiled for later rehabilitation, the ore is ripped or, where it's harder, drilled and blasted, then loaded directly onto haul trucks. There's comparatively little blasting relative to hard-rock metal mining, since laterite bauxite is often soft enough to rip mechanically without explosives.</p>

<h3>Beneficiation and Washing</h3>
<p>Run-of-mine bauxite typically goes through crushing, screening, and washing to remove clay and reduce silica content before it's shipped or fed into a refinery, since reactive silica is one of the most economically damaging impurities in downstream processing — every unit of it ties up alumina and caustic soda in an unrecoverable byproduct. Washing plants near the mine reject the fine clay fraction and upgrade the shipped product's alumina-to-silica ratio, usually the first number a refinery buyer checks on an assay sheet.</p>

<img src="${images.gallery1.url}" alt="${images.gallery1.caption}" />

<h2>The Bayer Process: Turning Ore Into Alumina</h2>
<p>Metallurgical-grade bauxite becomes aluminum through two industrial processes stacked end to end. First, the Bayer process digests crushed bauxite in hot caustic soda under pressure, dissolving the aluminum hydroxide minerals into solution while leaving iron oxide, titanium dioxide, and undissolved silica behind as a dense, red-brown residue known as red mud. The dissolved aluminum is then precipitated out as aluminum hydroxide and calcined at high temperature to drive off water, leaving pure white alumina (Al₂O₃) powder.</p>
<p>Second, that alumina is dissolved in molten cryolite and electrolyzed in the Hall-Héroult process, splitting it into metallic aluminum and oxygen using enormous amounts of electricity — which is exactly why aluminum smelters cluster around cheap, reliable power, hydroelectric dams in particular, rather than around the bauxite mines themselves. It takes roughly four tonnes of bauxite to produce two tonnes of alumina, which in turn yields close to one tonne of aluminum metal.</p>

<h2>Global Production Context</h2>
<p>Global bauxite output runs well over 400 million tonnes a year, with Australia, Guinea, and China accounting for most of it between mining and refining capacity. Guinea's rapid expansion over the past decade has made it one of the largest exporters of raw ore by tonnage, much of it shipped directly to Chinese refineries rather than processed domestically. China, for its part, refines more alumina than any other country despite holding comparatively modest bauxite reserves of its own — which is a large part of why so much seaborne bauxite trade points toward Chinese ports regardless of which country actually mined the rock.</p>

<h2>Not All Bauxite Is Metallurgical Grade — and That Matters for Buyers</h2>
<p>This is the point where a lot of generic explainers go vague, and I'd rather be specific: not every bauxite deposit suits the Bayer process, and treating "bauxite" as one uniform tradeable commodity is a mistake buyers tend to make right up until an assay comes back wrong. Metallurgical-grade ore generally needs upward of 45–50% total Al₂O₃ with low reactive silica — commonly under 5 to 6 percent — to refine economically. Pakistan's known occurrences, around Mansehra, Kohat, and parts of Azad Jammu & Kashmir, are genuine lateritic deposits, but they typically carry higher iron oxide and higher silica than a Bayer-process refinery wants to see on its assay sheet.</p>
<p>What that means in practice: most of what moves credibly as bauxite ore supplier volume out of Pakistan today is cement-grade and refractory-grade material rather than metallurgical, aluminum-grade ore. That's not a knock on the resource — cement and refractory buyers have real, steady demand and don't need Guinea-grade purity — but a buyer approaching a bauxite exporter Pakistan sourcing conversation expecting Jamaican or Australian metallurgical specifications on a Pakistani cargo is going to be disappointed by the lab report. Set expectations by end application and the deposit looks a lot more useful.</p>

<img src="${images.gallery2.url}" alt="${images.gallery2.caption}" />

<h2>Industrial Uses Beyond Aluminum Metal</h2>
<p>Aluminum smelting gets all the attention, but it isn't the only market for bauxite — and for a lower-purity deposit, it isn't even the most realistic one.</p>

<h3>Cement Manufacturing</h3>
<p>Bauxite is a valued corrective material in Portland cement clinker production, added in small percentages to adjust the alumina modulus of the raw mix, and it's the primary raw material in calcium aluminate cement — a fast-setting, refractory, chemically resistant cement used in everything from repair mortars to furnace linings. Cement plants care far less about reactive silica than a Bayer refinery does, which makes this market a natural fit for lateritic bauxite that would never clear a metallurgical assay.</p>

<h3>Refractories</h3>
<p>Calcined bauxite — bauxite fired at high temperature to drive off moisture and increase hardness — is a workhorse raw material for high-alumina refractory bricks and monolithics that line steel furnaces, cement kilns, and glass tanks, prized for its high melting point and resistance to thermal shock.</p>

<h3>Abrasives</h3>
<p>Fused in an electric arc furnace with minor additions, bauxite becomes brown fused alumina, one of the most widely used abrasive grains in grinding wheels, sandpaper, and blasting media — a market that, again, tolerates the iron content that would disqualify the same ore from a metallurgical smelter.</p>

<h2>Bauxite Exporter Pakistan: Sourcing and Export Logistics</h2>
<p>We supply bauxite from Pakistan's northern lateritic deposits, sized and graded for the cement and refractory markets that actually want this material's chemistry — typically running 45–55% Al₂O₃ on a total basis, with iron oxide and silica reported alongside on every assay shipped with a cargo. Material moves out in lump or crushed form, packed in jumbo bags for smaller lots or loaded as bulk break-bulk cargo for full container or vessel-scale orders, through Karachi Port and Port Qasim to cement plants, refractory manufacturers, and abrasive producers across the Gulf and South Asia. Moisture content is worth watching closely on bulk vessel bookings, since absorbed water is dead weight a buyer pays freight on and, above certain thresholds, triggers damp-cargo handling requirements under the IMSBC code that governs solid bulk cargo at sea. We report moisture on every assay and adjust drying before loading whenever a buyer's contract specifies a ceiling.</p>

<img src="${images.gallery3.url}" alt="${images.gallery3.caption}" />

<h2>What to Ask Your Bauxite Ore Supplier</h2>
<p>If you're evaluating a bauxite ore supplier — us or anyone else — insist on an independent or third-party-verifiable assay before committing to a shipment, not a specification sheet copied from a competitor's brochure. At minimum, ask for total Al₂O₃, reactive versus total SiO₂ (the distinction matters enormously if you're refining), Fe₂O₃ content, moisture, and a particle-size breakdown if you need a specific mesh. If your end use is cement or refractory rather than metallurgical, don't over-specify reactive silica limits that only matter to a Bayer-process buyer — you'll needlessly narrow your supplier pool and pay for a purity level your kiln or furnace will never notice. On larger shipments, it's also worth asking how the assay sample was drawn in the first place: a composite pulled from multiple points across the stockpile is far more representative than a single grab sample skimmed off the top of a pile, and a supplier confident in their material will say so before you even ask.</p>

<h2>Conclusion</h2>
<p>Bauxite's usefulness runs well past the aluminum can in your recycling bin — it's the feedstock behind cement modifiers, furnace refractories, and industrial abrasives, and a large share of global bauxite tonnage never sees a smelter at all. The deposits that do feed metallurgical refineries need a specific, fairly narrow chemistry that not every bauxite region on earth can deliver, and buyers who understand that distinction, rather than shopping on the word "bauxite" alone, end up with material that actually matches what their process needs.</p>
`.trim(),
  },
];

const uploadArticleImages = async (spec, folderTag) => {
  const result = {};
  for (const [key, img] of Object.entries(spec)) {
    const uploaded = await cloudinary.uploader.upload(img.url, { folder: img.folder });
    result[key] = { url: uploaded.secure_url, publicId: uploaded.public_id, caption: img.caption };
    console.log(`[${folderTag}] uploaded ${key}: ${uploaded.secure_url}`);
  }
  return result;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const author = await User.findOne({ role: "admin" });

    for (const spec of ARTICLES) {
      const slug = slugify(spec.title, { lower: true, strict: true });
      const existing = await Article.findOne({ slug });

      // Reuse already-uploaded Cloudinary assets on re-run instead of duplicating them.
      const images =
        existing?.coverImage?.publicId && existing?.gallery?.length === 3
          ? {
              cover: existing.coverImage,
              gallery1: existing.gallery[0],
              gallery2: existing.gallery[1],
              gallery3: existing.gallery[2],
            }
          : await uploadArticleImages(spec.images, slug);
      const content = spec.buildContent(images);

      const articleData = {
        title: spec.title,
        slug,
        excerpt: spec.excerpt,
        content,
        coverImage: { url: images.cover.url, publicId: images.cover.publicId },
        gallery: [
          { url: images.gallery1.url, publicId: images.gallery1.publicId, caption: images.gallery1.caption },
          { url: images.gallery2.url, publicId: images.gallery2.publicId, caption: images.gallery2.caption },
          { url: images.gallery3.url, publicId: images.gallery3.publicId, caption: images.gallery3.caption },
        ],
        category: spec.category,
        tags: spec.tags,
        status: "published",
        isFeatured: spec.isFeatured,
        seo: spec.seo,
        ...(author ? { author: author._id } : {}),
      };

      let article = existing;
      if (article) {
        Object.assign(article, articleData);
        await article.save();
        console.log(`Updated existing article: ${article.slug}`);
      } else {
        article = new Article(articleData);
        await article.save();
        console.log(`Created new article: ${article.slug}`);
      }

      console.log(`  id=${article._id} words=${article.wordCount} readTime=${article.readTime}min`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

run();
