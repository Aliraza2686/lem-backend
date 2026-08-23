import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Article from "../modals/Article.js";
import User from "../modals/User.js";

dotenv.config();

const TITLE = "How Bentonite is Used in Piling and Construction";
const SLUG = slugify(TITLE, { lower: true, strict: true });

// Real, freely-usable stock photos (Pexels) — relevant to drilling rigs / construction sites.
const SOURCE_IMAGES = [
  {
    key: "cover",
    url: "https://images.pexels.com/photos/15743467/pexels-photo-15743467.jpeg",
    caption: "A piling rig drilling a borehole, supported by bentonite slurry, at a construction site",
  },
  {
    key: "gallery1",
    url: "https://images.pexels.com/photos/7910062/pexels-photo-7910062.jpeg",
    caption: "A heavy drilling rig advancing a borehole during bored pile installation",
  },
  {
    key: "gallery2",
    url: "https://images.pexels.com/photos/4170184/pexels-photo-4170184.jpeg",
    caption: "Aerial view of a large-scale foundation construction site with piling works underway",
  },
  {
    key: "gallery3",
    url: "https://images.pexels.com/photos/69483/pexels-photo-69483.jpeg",
    caption: "An urban construction site showing excavation, piling, and scaffolding activity",
  },
];

const uploadSourceImages = async () => {
  const results = {};
  for (const img of SOURCE_IMAGES) {
    const result = await cloudinary.uploader.upload(img.url, {
      folder: "articles/bentonite-piling",
    });
    results[img.key] = {
      url: result.secure_url,
      publicId: result.public_id,
      caption: img.caption,
    };
    console.log(`Uploaded ${img.key}: ${result.secure_url}`);
  }
  return results;
};

const buildContent = (images) => `
<p>Few materials are as quietly indispensable to modern foundation engineering as bentonite. Every day, on construction sites around the world, this unassuming clay makes it possible to drill deep, stable boreholes through loose, water-bearing ground that would otherwise collapse the moment an auger pulled out of it. This article explains what bentonite is, why it behaves the way it does, and how contractors use it to support some of the largest and most demanding foundation systems in the industry — bored piles and diaphragm walls.</p>

<img src="${images.cover.url}" alt="${images.cover.caption}" />

<h2>What Is Bentonite?</h2>
<p>Bentonite is a naturally occurring clay formed primarily from the weathering of volcanic ash, composed predominantly of the mineral montmorillonite. Commercial deposits are mined and processed around the world, including significant reserves in Pakistan's Khewra range, and are graded according to their swelling capacity, viscosity-building performance, and impurity content.</p>
<p>What sets bentonite apart from ordinary clay is its unusual crystalline structure. Montmorillonite particles are extremely thin, plate-like layers with a large surface area and a net negative charge. When these particles come into contact with water, water molecules are drawn between the layers, forcing them apart. This is the basis of bentonite's most commercially important property: swelling.</p>

<h3>Swelling Behaviour</h3>
<p>Sodium-activated bentonite can absorb many times its own dry weight in water and expand to several times its original volume. As it swells, the clay platelets disperse into a colloidal suspension, and the fluid thickens dramatically even at low concentrations — typically 4 to 6 percent bentonite by weight of water is enough to produce a workable drilling slurry. This swelling behaviour is what allows a relatively small quantity of clay to transform ordinary water into a fluid capable of holding open a vertical excavation many metres deep.</p>

<h3>Thixotropic Properties</h3>
<p>Equally important is bentonite's thixotropic behaviour: the property of becoming more fluid when agitated (sheared) and gelling into a semi-solid state when left at rest. On a drilling rig, this means the slurry can be pumped, circulated, and agitated freely while drilling is active, flowing easily around the drill string and through the pump system. The moment circulation stops — for example, while a drill crew changes tools or lowers a reinforcement cage into the borehole — the suspended clay particles link together into a gel structure. This gel suspends drill cuttings and sand particles that would otherwise settle to the bottom of the hole, and it also helps the slurry maintain hydrostatic pressure against the borehole wall. Without thixotropy, cuttings would sink to the base of a pile the instant pumping stopped, contaminating the concrete and weakening the foundation.</p>

<h2>The Role of Bentonite Slurry in Bored and Diaphragm Pile Drilling</h2>
<p>Bored piles and diaphragm walls are constructed by excavating a deep, narrow shaft or trench into the ground and later filling it with reinforcement and concrete. The challenge is that the excavation must remain open and stable — sometimes for many hours — through soil layers that are loose, sandy, or below the water table and would naturally collapse inward without support.</p>
<p>Bentonite slurry solves this problem by filling the excavation as drilling progresses, keeping the borehole full of fluid at all times. Because the slurry is denser than groundwater and exerts a positive hydrostatic pressure against the surrounding soil, it counteracts the tendency of the borehole walls to cave in. This is the central engineering principle behind slurry-supported excavation: the fluid pressure of the bentonite column must always exceed the combined pressure of groundwater and lateral earth pressure acting on the excavation face.</p>

<img src="${images.gallery1.url}" alt="${images.gallery1.caption}" />

<h3>Mud Circulation</h3>
<p>On most bored pile rigs, bentonite slurry is actively circulated rather than left static in the hole. Fresh or reconditioned slurry is pumped down through the drill string (or through a separate tremie/circulation line), and returns to the surface carrying suspended drill cuttings. At the surface, this "used" slurry passes through a desanding plant — typically a combination of shale shakers, hydrocyclones, and settling tanks — which separates coarse cuttings and sand from the fluid before it is returned to the borehole. This circulation loop performs three functions simultaneously: it removes drilled spoil from the hole, it keeps the slurry properties within specification, and it maintains the hydrostatic head needed to support the excavation.</p>

<h3>Filter Cake Formation</h3>
<p>As bentonite slurry sits against a permeable soil face, a small amount of the fluid phase (water) filters into the surrounding ground under the pressure differential, while the suspended clay particles are too large to pass through the soil pores. Those particles are deposited on the borehole wall as a thin, low-permeability layer known as a filter cake or mud cake. This cake is critical: it seals the borehole face, dramatically reduces further fluid loss into the formation, and provides a smooth, semi-impermeable membrane against which the hydrostatic pressure of the slurry column can act effectively. A well-formed filter cake is thin, tough, and low in permeability; a poorly conditioned slurry produces a thick, crumbly cake that can trap material against the pile shaft and interfere with concrete-to-soil bond (skin friction), reducing the pile's load-carrying capacity.</p>

<h2>Environmental and Ground Stabilization Uses</h2>
<p>Beyond piling, bentonite's swelling and low-permeability characteristics are used more broadly in ground engineering and environmental containment. Compacted bentonite or bentonite-enhanced soil mixtures are used to line landfills, ponds, and containment cells, because the swollen clay forms a barrier with extremely low hydraulic conductivity, restricting the migration of leachate or contaminated water. Bentonite is also a key ingredient in cutoff walls — vertical barriers, sometimes constructed using the same slurry-trench method as diaphragm walls, that are installed around contaminated sites or beneath dams and levees to control groundwater seepage. In tunnelling, bentonite slurry is used in slurry-shield tunnel boring machines to support the excavation face in soft or waterlogged ground, performing much the same stabilizing role it does in piling.</p>

<img src="${images.gallery2.url}" alt="${images.gallery2.caption}" />

<h2>Bentonite Slurry vs. Polymer Slurry</h2>
<p>In recent decades, synthetic polymer slurries have become a widely used alternative to bentonite for borehole support, and contractors frequently weigh the two options against each other.</p>
<ul>
<li><strong>Filter cake:</strong> Bentonite forms a physical filter cake on the borehole wall; polymer slurries generally do not, instead relying on viscosity and a degree of soil-pore "plugging" to control fluid loss. This can improve pile shaft friction where filter cake residue would otherwise be a concern.</li>
<li><strong>Density and support mechanism:</strong> Bentonite slurry relies partly on its density and filter cake to support the excavation; polymer slurries are typically close to the density of water and rely more heavily on maintaining a continuous fluid column and viscosity to prevent collapse, which can be less forgiving in highly permeable or coarse granular soils.</li>
<li><strong>Site handling:</strong> Bentonite requires mixing, hydration time, and a desanding plant to manage recycled slurry and cuttings disposal. Polymer slurries are often quicker to mix, require less storage space, and can sometimes be disposed of more easily, though they are usually more expensive per cubic metre.</li>
<li><strong>Ground conditions:</strong> Bentonite remains the more proven, robust choice in a wide range of soils, particularly where high fluid loss control and filter cake formation are beneficial. Polymer slurries are often preferred in clean sands and gravels, or where minimizing filter cake for shaft friction is a priority, and where site space or environmental handling constraints favour a lower-volume system.</li>
</ul>
<p>In practice, many contractors select between the two — or use hybrid polymer-bentonite systems — based on the specific geology, environmental regulations, and structural performance requirements of the project.</p>

<h2>Quality Control: Testing Bentonite Slurry on Site</h2>
<p>Because the performance of a bored pile or diaphragm wall depends directly on the condition of the slurry supporting it during excavation and concreting, slurry quality is tightly controlled and tested throughout construction, both for freshly mixed slurry and for slurry recovered from the borehole immediately before concrete placement.</p>

<h3>Mud Weight (Density)</h3>
<p>Measured with a mud balance, density indicates how much solid material — bentonite plus suspended drill cuttings and sand — is present in the fluid. Freshly mixed bentonite slurry typically has a density in the range of about 1.03 to 1.10 g/cm³. As drilling progresses and the slurry picks up fine soil particles, density rises; if it climbs too high, the slurry becomes overloaded with solids, increases the risk of poor filter cake formation and entrapped material in the concrete, and must be reconditioned or partially replaced.</p>

<h3>Viscosity</h3>
<p>Viscosity is commonly measured using a Marsh funnel, which times how long a fixed volume of slurry takes to flow through a calibrated orifice. Typical specifications call for a Marsh funnel time of roughly 32 to 50 seconds, depending on the project specification and soil conditions. Viscosity that is too low will not adequately suspend cuttings or maintain borehole stability; viscosity that is too high makes the slurry difficult to pump and can trap air or prevent cuttings from settling out properly in the desanding plant.</p>

<h3>Sand Content</h3>
<p>Sand content is measured using a sand content test kit, in which a slurry sample is washed through a fine mesh screen and the retained sand is read off a graduated tube. Excessive sand content — commonly specified to be kept below about 4 percent by volume — increases slurry density and abrasiveness, contributes to poor filter cake quality, and, if present in slurry displaced by concrete during placement, can settle within the pile shaft and compromise its structural integrity.</p>

<h3>pH and Other Checks</h3>
<p>Slurry pH is typically maintained in a mildly alkaline range (commonly around 8 to 11) to promote proper bentonite hydration and yield; contamination from cement, seawater, or certain groundwater chemistries can flocculate the clay particles and severely degrade slurry performance, so pH and, on larger projects, additional checks such as filtrate loss and gel strength are monitored routinely.</p>

<img src="${images.gallery3.url}" alt="${images.gallery3.caption}" />

<h2>Best Practices on Site</h2>
<p>Consistent, well-supported pile and wall construction depends on disciplined slurry management from mixing through to concrete placement. Some of the most important practices include:</p>
<ul>
<li><strong>Adequate hydration time:</strong> Freshly mixed bentonite should be allowed to hydrate — often for a minimum of several hours — before use, since inadequately hydrated slurry will not develop full viscosity or gel strength.</li>
<li><strong>Maintaining slurry level:</strong> The slurry level in the borehole should be kept at or near ground level (or at least a specified minimum head above groundwater level) at all times during excavation, reinforcement placement, and concreting, since a drop in level immediately reduces the supporting hydrostatic pressure and risks collapse.</li>
<li><strong>Routine desanding:</strong> Circulating slurry through a desanding plant regularly prevents solids build-up and keeps density and sand content within specification, particularly in sandy or gravelly ground where cuttings accumulate quickly.</li>
<li><strong>Testing before concreting:</strong> Slurry properties at the base of the borehole are typically re-tested immediately before tremie concreting begins, since heavily contaminated slurry left at the bottom of a hole can become trapped beneath the rising concrete and form a structural defect.</li>
<li><strong>Tremie technique:</strong> Concrete is placed using a tremie pipe that stays submerged within the concrete mass throughout the pour, displacing the bentonite slurry upward and out of the borehole from the bottom up, rather than allowing concrete to fall through and mix with the slurry.</li>
<li><strong>Slurry recycling and disposal:</strong> Used slurry and separated cuttings must be handled and disposed of in accordance with local environmental regulations; many sites recycle slurry across multiple piles to reduce material consumption and waste volumes.</li>
</ul>

<h2>Sourcing Bentonite for Construction Projects</h2>
<p>Not all commercial bentonite performs equally well as a drilling fluid, and specifying the right grade matters as much as following correct site procedures. Contractors typically look for sodium-activated (or naturally sodium-rich) bentonite with high montmorillonite content, since this is what drives strong swelling and viscosity-building performance at low dosage rates. Suppliers usually characterize drilling-grade bentonite by yield (the volume of usable slurry a given weight of clay can produce at a target viscosity), moisture content, particle size distribution, and impurity levels such as sand, grit, or free silica, all of which affect how predictably the material hydrates and how much fine screening is needed once it reaches the desanding plant.</p>
<p>Consistency between deliveries is just as important as the specification on paper. Because a project's mix design, pump settings, and desanding equipment are usually calibrated around a particular yield and viscosity response, a change in bentonite source or grade partway through a job can force a contractor to re-trial mix ratios and re-verify hydration times before resuming production drilling. For this reason, many contractors on large or multi-phase piling and diaphragm wall projects prefer to secure their full bentonite tonnage from a single processor or exporter with documented quality control, rather than sourcing opportunistically from multiple suppliers as work progresses.</p>

<h2>Conclusion</h2>
<p>Bentonite's combination of swelling capacity and thixotropic behaviour makes it one of the most effective and widely used materials for supporting deep excavations in foundation engineering. From bored piles and diaphragm walls to environmental cutoff barriers and tunnelling, its ability to form a stable, self-sealing suspension that can be pumped when needed and gels when at rest has made it a mainstay of geotechnical construction for decades. Rigorous quality control — tracking mud weight, viscosity, sand content, and pH — combined with disciplined site practices around circulation, hydration, and concreting, is what turns this simple clay mineral into the engineered foundation of some of the world's largest structures.</p>
`.trim();

const seedArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const author = await User.findOne({ role: "admin" });

    const existing = await Article.findOne({ slug: SLUG });

    // Reuse already-uploaded Cloudinary assets on re-run instead of duplicating them.
    const images =
      existing?.coverImage?.publicId && existing?.gallery?.length === 3
        ? {
            cover: existing.coverImage,
            gallery1: existing.gallery[0],
            gallery2: existing.gallery[1],
            gallery3: existing.gallery[2],
          }
        : await uploadSourceImages();

    const content = buildContent(images);

    const articleData = {
      title: TITLE,
      slug: SLUG,
      excerpt:
        "Bentonite's swelling and thixotropic properties make it essential for supporting bored piles and diaphragm walls. Here's how it works, how it's tested, and how it compares to polymer slurries.",
      content,
      coverImage: { url: images.cover.url, publicId: images.cover.publicId },
      gallery: [
        { url: images.gallery1.url, publicId: images.gallery1.publicId, caption: images.gallery1.caption },
        { url: images.gallery2.url, publicId: images.gallery2.publicId, caption: images.gallery2.caption },
        { url: images.gallery3.url, publicId: images.gallery3.publicId, caption: images.gallery3.caption },
      ],
      category: "Construction Materials",
      tags: ["bentonite", "piling", "drilling", "construction", "geotechnical"],
      status: "published",
      isFeatured: true,
      seo: {
        metaTitle: "How Bentonite is Used in Piling and Construction | Lumina Earth Minerals",
        metaDescription:
          "A detailed look at how bentonite slurry supports bored pile and diaphragm wall construction, from swelling properties to on-site quality control.",
        keywords: ["bentonite", "piling", "drilling slurry", "diaphragm wall", "geotechnical construction"],
      },
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

    console.log("Article ID:", article._id.toString());
    console.log("Cover image URL:", article.coverImage.url);
    console.log("Word count / read time:", article.wordCount, "words /", article.readTime, "min");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedArticles();
