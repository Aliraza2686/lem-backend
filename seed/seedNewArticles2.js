import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../modals/User.js";

dotenv.config();

const API_BASE = process.env.SEED_API_BASE || "http://localhost:4000";

// ---------------------------------------------------------------------------
// Article specs. Each `content` field is full HTML (h2/h3 structure) with
// <img> placeholders for cover/gallery1/gallery2/gallery3 that get resolved
// to Cloudinary URLs AFTER the real API upload (the API generates those URLs,
// not this script) — so we post once to create, then patch image srcs via a
// second PUT if needed. To keep this simple and match how the API actually
// works (images come back only after upload), we instead build content with
// the SOURCE image URLs inline as a placeholder marker, upload via the real
// multipart POST /api/articles endpoint, then PUT to swap in the real
// Cloudinary URLs returned by that same create response.
// ---------------------------------------------------------------------------

const ARTICLES = [
  {
    title: "Sourcing Bulk Sodium Bentonite for Piling Contractors: Dosage, Specs, and Supplier Vetting",
    excerpt:
      "A procurement-focused guide for piling contractors buying sodium bentonite in volume — how to size a dosage estimate, what to put in a purchase spec, and how to vet a supplier before the first container ships.",
    category: "Construction Materials",
    tags: ["bentonite for piling", "sodium bentonite drilling mud supplier", "bentonite construction grade exporter", "bentonite for bored piles", "bentonite slurry supplier"],
    metaTitle: "Bentonite for Piling: A Procurement Guide for Contractors | Lumina Earth Minerals",
    metaDescription:
      "How to estimate dosage, write a purchase spec, and vet a bentonite slurry supplier for bored pile and diaphragm wall projects — from a bentonite construction grade exporter.",
    keywords: ["bentonite for piling", "sodium bentonite drilling mud supplier", "bentonite construction grade exporter", "bentonite for bored piles", "bentonite slurry supplier"],
    isFeatured: true,
    coverImageUrl: "https://images.pexels.com/photos/14192787/pexels-photo-14192787.jpeg",
    galleryImageUrls: [
      "https://images.pexels.com/photos/12709141/pexels-photo-12709141.jpeg",
      "https://images.pexels.com/photos/27791127/pexels-photo-27791127.jpeg",
      "https://images.pexels.com/photos/1624694/pexels-photo-1624694.jpeg",
    ],
    galleryCaptions: [
      "Foundation and piling works underway on a large-scale building site",
      "Bulk material sacks staged in a warehouse ahead of dispatch",
      "Stacked containers at a commercial port ready for export loading",
    ],
    buildContent: (g) => `
<p>A procurement manager ordering bentonite for a 400-pile foundation job for the first time usually makes the same mistake: they price the material like cement, per bag, and only discover the real variable — yield — once the first batch of slurry comes off the mixer thinner than the site engineer expected. Buying bentonite for piling isn't complicated once you know what actually drives cost and performance, but it's easy to get wrong by treating a technical raw material like a commodity you order off a price sheet. This is a procurement guide, not a chemistry lesson: how much to order, what to specify, and how to tell a reliable supplier from one who'll cost you a remix halfway through a pour schedule.</p>

<img src="${g.cover}" alt="Foundation excavation at a large construction site" />

<h2>What "Piling Grade" Actually Means on a Purchase Order</h2>
<p>Piling-grade bentonite is a general-purpose sodium or sodium-activated calcium bentonite, processed to build viscosity and form a filter cake at working dosage without the tighter API filtration tolerances an oil-well mud engineer would demand. It sits in a middle tier: not as purity-controlled as an oil-grade product, but more consistent and higher in montmorillonite content than a raw, unprocessed clay. Ordering "bentonite" without specifying grade is how contractors end up with a product graded for pond lining or pet litter arriving on a piling job, and neither the yield nor the sand content will hold up under a drill rig's circulation demands.</p>

<h3>Natural vs. Activated Sodium Content</h3>
<p>Some deposits are naturally sodium-dominant and swell strongly straight out of the ground; a larger share of the world's commercial bentonite is calcium-based ore that's been treated with soda ash to exchange calcium ions for sodium on the clay surface, a step generally called sodium activation. For piling work, a well-activated calcium bentonite performs close enough to natural sodium bentonite that the distinction rarely matters on-site — what matters is the yield number the supplier can actually back up, not which side of that line the raw ore started on.</p>

<h2>Dosage: How Much Bentonite a Project Actually Needs</h2>
<p>Slurry mix designs for bored piles and diaphragm walls typically run 4 to 6 percent bentonite by weight of water, which sounds low until you multiply it across a project's total slurry volume. A single large-diameter bored pile — say 1.2 metres in diameter and 25 metres deep — displaces roughly 28 cubic metres of borehole volume, and at a 5 percent mix ratio that's in the neighborhood of 1.3 to 1.5 tonnes of dry bentonite per pile before accounting for recirculation losses and desanding plant wastage, which commonly add another 15 to 25 percent to the raw figure.</p>

<h3>Estimating Tonnage for a Piling Program</h3>
<p>For program-level ordering, most contractors work backward from pile count and average depth rather than recalculating volume pile by pile. A 300-pile program at similar dimensions to the example above lands somewhere around 500 to 650 tonnes of bentonite once wastage and recycling efficiency are factored in — recycling efficiency being the variable that swings this number the most, since a well-run desanding plant can stretch a tonne of bentonite across more piles than a site running minimal circulation equipment. Ordering the full program quantity up front, rather than in smaller repeat orders, is usually the better call: it locks pricing, avoids mid-program supply gaps, and — just as important — keeps every pile on the same batch chemistry instead of blending slurry properties from multiple deliveries partway through the job.</p>

<img src="${g[0]}" alt="Foundation and piling works underway on a large-scale building site" />

<h2>What to Put in a Purchase Specification</h2>
<p>A one-line purchase order that just says "bentonite, 25 tonnes" leaves too much room for a supplier to substitute a lower grade at the same price point. A workable spec should include, at minimum, montmorillonite content as a percentage, a target wet yield figure at a stated dosage rate, maximum moisture content, mesh size (typically -200 mesh with a stated minimum passing percentage), and a maximum sand or grit content by weight. None of these numbers need to match oil-grade tolerances — piling work doesn't need them — but they need to be stated and testable, not implied.</p>

<h3>Montmorillonite Content and Yield</h3>
<p>Montmorillonite content in a decent piling-grade product typically runs 65 to 80 percent, well below an oil-grade material's 85 to 90 percent, and that's fine — it's priced accordingly and still delivers workable viscosity at standard site dosage rates. What matters is that the yield figure on the spec sheet is one the supplier will guarantee against an independent test, not just print on a brochure.</p>

<h3>Moisture, Mesh Size, and Impurities</h3>
<p>Moisture content above roughly 12 to 14 percent starts eating into effective yield, because you're paying freight and price per tonne on water weight that does nothing for slurry performance. Mesh size affects how quickly the material hydrates once it hits the mixing tank — coarser material takes longer to fully disperse and can leave grit that shortens desanding screen life. None of this is exotic; it's simply worth writing down instead of assuming.</p>

<h2>Vetting a Bentonite Slurry Supplier</h2>
<p>The single biggest risk on a multi-month piling program isn't the first delivery — it's the fifteenth. A supplier who ships a strong sample batch and then drifts on quality once the relationship is established is a more common problem than outright fraud, and it's the one procurement teams are worst prepared for.</p>

<h3>Lab Documentation and Certificates of Analysis</h3>
<p>Ask for a certificate of analysis with every shipment, not just the first one, and specify that the COA numbers must be tested per delivered lot rather than copied from an original product spec sheet. A supplier who resists lot-by-lot testing, or who can only produce documentation for the sample they sent you during negotiations, is telling you something about how consistent the bulk product actually is.</p>

<h3>Consistency Across Deliveries</h3>
<p>Because desanding equipment and pump settings on a rig are usually calibrated around a particular yield and hydration response, a mid-program change in bentonite source — even a "similar spec" one — can force a contractor to re-trial mix ratios and re-verify hydration times before resuming production drilling. That's lost rig time nobody budgeted for. It's a strong reason to secure full program tonnage from a single processor with a documented track record rather than sourcing opportunistically as work progresses and prices fluctuate.</p>

<h3>Lead Times and Minimum Order Quantities</h3>
<p>Confirm lead time from confirmed order to delivery before you're mid-program and need it — for export shipments this commonly runs three to five weeks depending on packaging format and current mine output, and that number needs to sit comfortably inside your drilling schedule with margin for port delays. Also confirm minimum order quantities up front; a supplier whose MOQ is a full container load isn't a fit for a contractor trying to top up a partial shortfall mid-program.</p>

<img src="${g[1]}" alt="Bulk material sacks staged in a warehouse ahead of dispatch" />

<h2>Packaging and Delivery Formats</h2>
<p>Piling-grade bentonite typically moves in 25kg or 50kg PP bags for smaller sites with manual handling, one-tonne jumbo bags for sites with forklift or crane access at the mixing plant, or bulk loose in a tipper truck or bulk container for the largest programs where a dedicated silo and pneumatic unloading system are already in place. The right format is mostly a function of your site's material handling setup rather than the bentonite itself — a large program with no bulk unloading equipment is often better served by jumbo bags than by insisting on bulk loose shipment and then improvising the unload.</p>

<h2>Common Procurement Mistakes</h2>
<p>The recurring pattern worth flagging: buyers price-shop bentonite the way they'd price-shop aggregate, comparing cost per tonne without normalizing for yield, and end up needing more tonnage from the "cheaper" supplier to hit the same slurry performance — which erases the savings and sometimes reverses it. The other common mistake is treating the sample batch used during supplier selection as representative of every delivery that follows, without a lot-testing clause in the contract to hold the supplier to it.</p>

<img src="${g[2]}" alt="Stacked containers at a commercial port ready for export loading" />

<h2>Conclusion</h2>
<p>Buying bentonite for a piling program comes down to three things done properly: sizing the order against realistic recirculation and wastage rates rather than theoretical borehole volume alone, writing a purchase spec that names testable numbers instead of trusting a brochure, and vetting a supplier for lot-to-lot consistency rather than a single strong sample. Get those three right and the material stops being a variable the site has to manage — it just does the job it's there to do, pour after pour.</p>
`.trim(),
  },
  {
    title: "How Oil-Grade Bentonite Is Processed Differently From Other Grades",
    excerpt:
      "API-spec drilling mud doesn't start life different from any other bentonite ore — it's the processing that makes it oil grade. Here's what happens between the mine and the mud pit, step by step.",
    category: "Drilling Fluids",
    tags: ["bentonite oil well drilling supplier", "API 13A bentonite", "oil grade bentonite exporter", "drilling mud bentonite supplier"],
    metaTitle: "How Oil-Grade Bentonite Is Processed | API 13A Production Steps | Lumina Earth Minerals",
    metaDescription:
      "From ore selection to sodium activation, drying, and milling — how oil-grade bentonite is processed differently from construction or water grades, from a bentonite oil well drilling supplier.",
    keywords: ["bentonite oil well drilling supplier", "API 13A bentonite", "oil grade bentonite exporter", "drilling mud bentonite supplier"],
    isFeatured: false,
    coverImageUrl: "https://images.pexels.com/photos/16862261/pexels-photo-16862261.jpeg",
    galleryImageUrls: [
      "https://images.pexels.com/photos/5662597/pexels-photo-5662597.jpeg",
      "https://images.pexels.com/photos/8442024/pexels-photo-8442024.jpeg",
      "https://images.pexels.com/photos/34891786/pexels-photo-34891786.jpeg",
    ],
    galleryCaptions: [
      "A large-scale drilling rig operating at a well site",
      "Laboratory technician running quality control checks on a processed material sample",
      "Packaged material staged in a warehouse ahead of shipment",
    ],
    buildContent: (g) => `
<p>Two bags of bentonite can come from the same mine, look identical, and perform nothing alike once they hit a mud pit. One builds viscosity predictably, holds fluid loss under 15 millilitres on an API test, and lays down a thin filter cake; the other clumps, underyields, and forces a mud engineer to dump extra product at the shale shaker just to hit spec. The ore didn't change. The processing did. Oil-grade bentonite isn't a different mineral from construction or water grade — it's the same montmorillonite clay run through a tighter, slower, more heavily tested production line, and understanding those steps is the fastest way to tell a real API-grade supplier from one who's just relabeling a general-purpose product.</p>

<img src="${g.cover}" alt="Drilling rig operating at a well site" />

<h2>Ore Selection: Not Every Deposit Qualifies</h2>
<p>Processing starts before the clay ever reaches a plant. Raw ore intended for oil-grade product is selected from zones within a deposit carrying higher natural montmorillonite content and lower contamination from quartz, feldspar, and carbonate impurities — material that would otherwise need to be screened out later at real cost. Mines producing multiple bentonite grades routinely stockpile ore separately by seam and assay result specifically so the highest-purity zones can be routed to oil-grade production rather than blended with everything else coming out of the pit.</p>

<h3>Raw Montmorillonite Content Before Processing</h3>
<p>Ore destined for oil-grade processing typically starts in the 70 to 80 percent montmorillonite range before activation and milling, compared with a lower and more variable starting point for material headed to construction or general-purpose grades. That gap compounds through every later step — activation chemistry, milling yield, and final product performance all respond more favorably to a cleaner starting material, which is a large part of why oil-grade product costs more even before a single processing step is counted.</p>

<h2>Sodium Activation: The Step That Actually Makes It "Oil Grade"</h2>
<p>Most commercial bentonite ore, including a large share of what comes out of Pakistan's Khewra range, is calcium-dominant in its raw state and needs to be sodium-activated to develop the swelling and viscosity-building performance a drilling mud requires. This is done by blending finely crushed ore with soda ash (sodium carbonate) and water, which drives an ion-exchange reaction that swaps calcium ions on the clay's exchange sites for sodium ions.</p>

<h3>Soda Ash Dosage and Reaction Time</h3>
<p>Dosage typically runs in the range of 3 to 6 percent soda ash by dry weight of clay, though the exact figure depends on the raw ore's cation exchange capacity and starting calcium content — a higher-calcium ore simply needs more soda ash to fully convert. Reaction time matters as much as dosage: activation is normally carried out in a pug mill or extruder with a controlled residence time of several minutes to allow the ion exchange to go to completion, followed by a curing or resting period, often 12 to 24 hours, that lets the exchange reaction stabilize before drying.</p>

<h3>Why Under- or Over-Activation Both Fail</h3>
<p>Under-dosed soda ash leaves a fraction of the clay's exchange sites still calcium-occupied, which shows up downhole as underperforming yield no lab test at the plant necessarily catches if the sample happened to come from a well-mixed batch. Over-dosing, on the other hand, wastes reagent cost without a proportional performance gain past the point where exchange sites are already saturated, and can leave excess soluble sodium carbonate in the finished product that affects mud pH more than intended. Getting this dosage right, consistently, batch after batch, is the single biggest quality lever in oil-grade production — more so than any step that comes after it.</p>

<img src="${g[0]}" alt="A large-scale drilling rig operating at a well site" />

<h2>Drying and Moisture Control</h2>
<p>Activated clay leaves the pug mill wet and has to be dried to a target moisture content, typically 8 to 12 percent for oil-grade product, low enough to mill efficiently and to avoid selling water weight as product, but not so low that the drying heat damages the clay's crystal structure. Rotary or fluidized-bed dryers running at controlled inlet temperatures are standard; overheating the clay during drying can degrade swelling capacity permanently, which is a quality failure that no amount of downstream testing can fix — it has to be prevented at this step, not caught later.</p>

<h2>Grinding and Mesh Size</h2>
<p>Dried clay is milled to a target particle size, commonly -200 mesh (74 microns) with 90 percent or more passing that screen for oil-grade material, finer than most construction-grade specifications require. Finer grinding increases the clay's effective surface area, which speeds hydration once the product hits the mud tank and improves yield at a given dosage — but over-grinding past the point of diminishing returns adds energy cost without a matching performance gain, so mills are tuned to a specific target rather than simply run as fine as the equipment allows.</p>

<h3>Why Particle Size Distribution Matters for Yield</h3>
<p>It isn't just the mesh cutoff that matters but the distribution around it — a batch with a wide spread of particle sizes hydrates unevenly, with the finest fraction swelling first and the coarsest fraction lagging, which shows up on a rig as slower-than-expected viscosity buildup even when the average mesh number on the spec sheet looks fine. Tight distribution control is one of the less visible differences between a consistent oil-grade producer and one that's cutting corners on mill maintenance.</p>

<img src="${g[1]}" alt="Laboratory technician running quality control checks on a processed material sample" />

<h2>The Testing Loop During Production</h2>
<p>Oil-grade production runs on a testing cycle that construction-grade lines simply don't bother with: sample pulls at defined intervals — often every batch or every few tonnes depending on plant scale — checked against Marsh funnel viscosity, API fluid-loss, and yield targets before the lot is approved for bagging. A batch that fails gets reworked, blended with a stronger lot to bring the average back into spec, or downgraded and sold into a lower-tier market rather than shipped as oil grade. This loop, run consistently, is what a certificate of analysis is actually certifying — not a one-off sample pulled to satisfy a buyer's request before the contract was signed.</p>

<h2>Packaging for Rig Delivery</h2>
<p>Finished product is typically packed in 25kg or 50kg multiwall paper or PP bags for smaller rig deliveries, or one-tonne jumbo bags and bulk container loads for larger drilling programs, with moisture-resistant packaging a real consideration since a bag that absorbs ambient humidity during transit or yard storage can drift out of spec before it ever reaches the rig floor.</p>

<h2>What This Means for Buyers Comparing Suppliers</h2>
<p>If two suppliers quote similar numbers on a spec sheet but meaningfully different prices, the honest question to ask isn't "which one is lying" — it's which processing steps the cheaper one is skipping or under-running. Soda ash dosage, cure time, drying temperature control, and mill maintenance are all real costs that show up in price, and cutting any one of them produces a product that can still pass a cursory sample test while underperforming on a real batch. Ask for lot-specific COAs, not a standard spec sheet, and ask how activation dosage is controlled — a supplier who can answer that in specific numbers, not generalities, is usually the one running the tighter process.</p>

<img src="${g[2]}" alt="Packaged material staged in a warehouse ahead of shipment" />

<h2>Conclusion</h2>
<p>Oil-grade bentonite earns its designation through a longer, more tightly controlled production path than any other grade of the same clay — better ore selection, precisely dosed sodium activation, careful drying, tighter milling, and a batch-by-batch testing loop that catches problems before they leave the plant. None of that is visible in a bag of finished powder, which is exactly why the processing history behind a shipment matters as much as the numbers printed on its spec sheet.</p>
`.trim(),
  },
  {
    title: "Water Grade Bentonite Quality Control: What to Check on a Certificate of Analysis",
    excerpt:
      "A certificate of analysis for water-grade bentonite carries different line items than an oil-grade one — and different stakes, since much of this material ends up in or near potable water. Here's what each number means.",
    category: "Water Treatment",
    tags: ["water grade bentonite", "bentonite water well drilling", "bentonite water treatment supplier"],
    metaTitle: "Water Grade Bentonite: Reading the Certificate of Analysis | Lumina Earth Minerals",
    metaDescription:
      "What montmorillonite content, swell index, heavy-metal screening, and sampling protocol actually mean on a water-grade bentonite COA — a guide from a bentonite water treatment supplier.",
    keywords: ["water grade bentonite", "bentonite water well drilling", "bentonite water treatment supplier"],
    isFeatured: false,
    coverImageUrl: "https://images.pexels.com/photos/5712211/pexels-photo-5712211.jpeg",
    galleryImageUrls: [
      "https://images.pexels.com/photos/8851634/pexels-photo-8851634.jpeg",
      "https://images.pexels.com/photos/15391048/pexels-photo-15391048.jpeg",
      "https://images.pexels.com/photos/27111449/pexels-photo-27111449.jpeg",
    ],
    galleryCaptions: [
      "A technician performing a laboratory quality check on a mineral sample",
      "An industrial drilling rig operating outdoors during well construction",
      "Bagged material stored and organized in a warehouse facility",
    ],
    buildContent: (g) => `
<p>A municipal water-board engineer forwarded us a certificate of analysis last year with a one-line question: "Is this good?" The sheet had eleven numbers on it, no context, and no way for someone outside a mineralogy lab to know which of those eleven actually mattered for a well that was going to feed a community water supply. That question comes up more often than it should, because water-grade bentonite COAs get treated as a formality — a document to file, not a spec to actually read — right up until a well underperforms or a treatment plant's clarification step doesn't work the way it was supposed to. Here's what the line items on a water-grade certificate actually mean, and which ones deserve real scrutiny before a shipment goes out.</p>

<img src="${g.cover}" alt="Water treatment facility infrastructure" />

<h2>Why Water-Grade Bentonite Needs a Different COA Than Oil-Grade</h2>
<p>An oil-grade certificate is built around downhole performance under pressure and temperature that a water well never sees — API fluid-loss, yield at high dosage, rheology under shear. A water-grade COA should be built around a different set of concerns: does the material develop enough viscosity to carry cuttings and hold a shallow borehole open, and — critically, because so much of this grade's end use eventually touches a potable water system — is it clean enough to sit in or near drinking water without introducing contamination. A supplier who hands a water-grade buyer the same certificate format used for an oil-grade order is usually testing for the wrong things, or not testing for the right ones at all.</p>

<h2>Montmorillonite Content and Swell Index</h2>
<p>Montmorillonite content for a decent water-grade product typically falls in the 75 to 85 percent range — lower than an oil-grade material's 85 to 90 percent, and that's expected, not a red flag, since water well applications don't need API-tier viscosity performance. More telling than the raw percentage is the free swell or swell index test, in which a small measured quantity of dry bentonite is added to a graduated cylinder of water and the settled volume is read after 24 hours. A swell index below roughly 8 to 10 millilitres per gram on this test is a warning sign regardless of what the montmorillonite percentage claims, since it means the clay isn't hydrating and dispersing the way an on-paper purity number would suggest.</p>

<h2>Moisture Content and Why It's Not Just About Weight</h2>
<p>Moisture above about 12 to 15 percent on a water-grade COA matters for two reasons, not one. The obvious reason is that you're paying freight and unit price on water weight rather than usable clay. The less obvious one is that elevated moisture in bagged storage creates conditions for the product to begin caking or partially hydrating in the bag before it ever reaches the wellhead, which shows up on-site as clumped material that won't disperse evenly when it's finally mixed.</p>

<img src="${g[0]}" alt="A technician performing a laboratory quality check on a mineral sample" />

<h2>Sand and Grit: Sieve Residue Numbers</h2>
<p>A wet-sieve residue test, typically run on a 200-mesh screen, reports the percentage of a sample that fails to pass — sand, grit, and unreacted mineral fragments that don't contribute to viscosity and instead behave as abrasive dead weight in the mixed fluid. For water-grade material, a residue figure under roughly 3 to 4 percent is a reasonable target; above that, expect faster wear on pump seals and more frequent settling-tank cleanout during well development.</p>

<h2>pH and Its Effect on Well Development</h2>
<p>Bentonite slurry pH typically reads in a mildly alkaline range, commonly 8 to 10, and that's generally fine for well drilling — but it's worth checking against the specific aquifer chemistry the well is targeting, since a mismatch between slurry pH and native groundwater chemistry can affect how completely the filter cake breaks down during well development, the step where drilling fluid is flushed and surged out of the formation before a well is put into service. A filter cake that doesn't break down cleanly leaves residual bentonite plugging the screen and formation, which shows up later as a well that never quite reaches its expected yield.</p>

<h2>Heavy Metal Screening for Potable Water Applications</h2>
<p>This is the line item that separates a water-grade COA from every other grade's certificate, and it's the one buyers most often skip asking for. Raw clay deposits naturally carry trace heavy metals — arsenic, lead, cadmium, and mercury are the ones regulatory frameworks typically flag — at levels that vary by deposit and are usually low enough to be a non-issue, but "usually low enough" isn't a substitute for a number on paper when the material is going into or near a drinking water system.</p>

<h3>Which Metals Actually Matter</h3>
<p>Arsenic and lead are the two worth prioritizing if a full heavy-metal panel isn't available or affordable for every lot — they're the contaminants most commonly regulated in drinking water standards and the ones most likely to be naturally present in clay-bearing formations at levels worth confirming rather than assuming.</p>

<h3>When Screening Is Optional vs. Required</h3>
<p>For a water well feeding a private irrigation system with no potable use, heavy-metal screening is a reasonable cost to skip. For a municipal well, a village water-board project, or any application where the well or the treated water reaches a drinking supply, it should be treated as non-negotiable — not because contamination is likely, but because the downside of an unscreened lot turning out to be a problem is disproportionate to the modest cost of testing for it up front.</p>

<img src="${g[1]}" alt="An industrial drilling rig operating outdoors during well construction" />

<h2>Sampling: How a COA Should Actually Be Drawn</h2>
<p>A certificate is only as good as the sample it was run on. A single grab sample skimmed off the top of a stockpile or the first bag off a pallet isn't representative of a multi-tonne lot, particularly for a material like bentonite where moisture and grinding fineness can vary across a production run. A composite sample — several increments drawn from different points across the lot and blended before testing — gives a far more honest picture, and a supplier confident in their consistency will describe their sampling protocol without being pressed on it.</p>

<h2>Red Flags on a Certificate</h2>
<p>A few things are worth treating as warning signs on sight: a COA with no date or lot number tying it to the specific shipment; heavy-metal results reported as "ND" (not detected) without stating the detection limit, which can mean the test simply wasn't sensitive enough to catch a real problem; and a certificate that matches a supplier's published spec sheet numbers exactly, digit for digit, across multiple unrelated orders — real lab results carry natural variation, and numbers that never move are a sign the same sheet is being reused rather than a fresh test being run.</p>

<img src="${g[2]}" alt="Bagged material stored and organized in a warehouse facility" />

<h2>Conclusion</h2>
<p>A water-grade bentonite certificate of analysis is doing a genuinely different job than an oil-grade one — it's not there to prove downhole rheology under pressure, it's there to confirm the material will hydrate predictably in a shallow well and won't introduce anything into a system that might eventually reach a tap. Read it for swell index and sieve residue to judge performance, and for heavy-metal screening and sampling protocol to judge whether it's safe for the application it's actually headed toward. A supplier who treats both halves of that seriously is worth the relationship; one who only has numbers for the first half is worth a harder look.</p>
`.trim(),
  },
  {
    title: "Himalayan Pink Salt Wholesale: A Guide for Bulk Buyers and Importers",
    excerpt:
      "Ordering Himalayan pink salt by the container is a different exercise than buying it by the jar. Here's what bulk buyers and importers should know about grades, packaging formats, lab documentation, and MOQs before placing a first order.",
    category: "Food Grade Minerals",
    tags: ["Himalayan pink salt wholesale supplier", "bulk Himalayan salt exporter", "pink salt manufacturer Pakistan", "Himalayan rock salt bulk"],
    metaTitle: "Himalayan Pink Salt Wholesale: A Bulk Buyer's Guide | Lumina Earth Minerals",
    metaDescription:
      "Grades, particle sizes, packaging formats, and lab certification to expect from a Himalayan pink salt wholesale supplier — a practical guide for importers and bulk buyers.",
    keywords: ["Himalayan pink salt wholesale supplier", "bulk Himalayan salt exporter", "pink salt manufacturer Pakistan", "Himalayan rock salt bulk"],
    isFeatured: true,
    coverImageUrl: "https://images.pexels.com/photos/9974508/pexels-photo-9974508.jpeg",
    galleryImageUrls: [
      "https://images.pexels.com/photos/5206830/pexels-photo-5206830.jpeg",
      "https://images.pexels.com/photos/13795451/pexels-photo-13795451.jpeg",
      "https://images.pexels.com/photos/15346128/pexels-photo-15346128.jpeg",
    ],
    galleryCaptions: [
      "Layers of rock salt exposed inside an underground salt mine",
      "Bulk commodity sacks staged for wholesale shipment",
      "Shipping containers loaded at a commercial port terminal",
    ],
    buildContent: (g) => `
<p>An importer placing a first order for Himalayan pink salt almost always starts by asking for "the pink one" and a price per kilogram, and almost always ends up back on the phone a week later asking why the quote they got is nothing like the number they'd budgeted. Retail pricing for a 200-gram jar on a supermarket shelf tells you nothing about container-load economics, and the grades, particle sizes, and packaging options that matter to a bulk buyer never show up on that jar's label. This is a working guide to what actually goes into a wholesale order — not the geology lecture, the procurement one.</p>

<img src="${g.cover}" alt="Himalayan pink salt crystals and blocks" />

<h2>Where Himalayan Pink Salt Actually Comes From</h2>
<p>Almost all commercially traded Himalayan pink salt originates from a narrow band of deposits in the Punjab Salt Range of Pakistan, laid down as marine evaporite beds hundreds of millions of years ago and later folded up into the hill formations that give the range its name. The pink to reddish color comes from trace iron oxide content within the halite crystal structure — the same chemistry that turns iron rust-colored elsewhere, just present here in far smaller, evenly distributed amounts.</p>

<h3>The Khewra Salt Mine</h3>
<p>The Khewra Salt Mine, one of the largest and oldest salt mines in the world, is the best-known source, though it's one of several workings across the range supplying export volume. Buyers occasionally ask whether "Khewra salt" and "Himalayan pink salt" are different products; they're not — Khewra is a specific mine within the broader Salt Range that the trade name refers to.</p>

<h2>Grades and Particle Sizes Buyers Order</h2>
<p>Wholesale orders split fairly cleanly by end use, and getting the grade right matters more to landed cost than most first-time buyers expect, since finer grinding and tighter sorting both add processing cost per tonne.</p>

<h3>Fine, Coarse, and Block/Lamp Forms</h3>
<p>Fine and table-grind salt, typically sized under 1mm, is the highest-volume category for food manufacturers blending it into seasoning products or retail table salt lines. Coarse and granular grades, often sorted in ranges like 2–5mm or 5–8mm, supply the culinary, bath-salt, and water-softener markets. Lamps, blocks, and cooking plates are sold as-is or lightly shaped from larger crystal pieces, and they're priced and packed entirely differently from ground salt — by piece weight and finish quality rather than by mesh size, which trips up buyers who try to request them using the same spec sheet used for granular orders.</p>

<h2>Color Variation and Why It's Not a Defect</h2>
<p>First-time buyers sometimes reject a shipment, or ask for a discount, because the salt isn't a uniform bright pink across every crystal — some pieces run pale pink, others closer to deep rose or even a light orange-red. That's normal mineral variation from natural iron oxide distribution within the deposit, not a sorting failure, and any genuine mine-sourced product will show some range. A shipment that's perfectly uniform in color, piece to piece, is more often a sign of dye or artificial tinting than of exceptional sorting — worth knowing before assuming uniformity is the higher-quality outcome.</p>

<img src="${g[0]}" alt="Layers of rock salt exposed inside an underground salt mine" />

<h2>Packaging Formats for Wholesale Orders</h2>
<p>Packaging is where a lot of the actual negotiation happens on a bulk order, since it drives both cost and how ready the product is for the buyer's own retail or industrial use downstream.</p>

<h3>Retail-Ready vs. Bulk Bag Packaging</h3>
<p>Some importers want retail-ready packaging done at origin — pouches, jars, or branded bags filled and labeled before the container leaves — which raises unit cost but skips a repackaging step domestically. Others want the lowest-cost bulk format, typically 25kg or 50kg PP bags or one-tonne jumbo bags, and handle grinding, sorting, or retail packaging themselves after import. A container-load order commonly runs 20 to 24 tonnes in bagged form, and mixed pallets — combining a few different grades or sizes in one container — are usually available for buyers who don't yet have volume to justify single-grade full containers.</p>

<h2>Lab Testing and Certificates</h2>
<p>A legitimate wholesale supplier should provide a certificate of analysis covering sodium chloride purity (typically 95 to 98 percent for natural, unrefined pink salt, with the remainder made up of trace minerals and moisture), moisture content, heavy-metal screening, and a microbiological panel if the product is destined for food use in a jurisdiction that requires it. Sodium chloride purity below roughly 95 percent on a food-grade order is worth questioning — it usually points to a higher-impurity mine zone or inadequate sorting, not necessarily a problem, but something to confirm against your import market's labeling requirements before committing to volume.</p>

<img src="${g[1]}" alt="Bulk commodity sacks staged for wholesale shipment" />

<h2>MOQs, Lead Times, and Shipping</h2>
<p>Minimum order quantities vary widely by supplier and packaging format — some will fill a mixed pallet order in the low tonnes, others require a full container commitment before they'll quote at all. Lead time from confirmed order to vessel loading commonly runs three to six weeks depending on grade, packaging complexity, and current mine output, with retail-ready packaging typically adding to that window versus a straightforward bulk-bag order. Shipment normally moves out through Karachi Port or Port Qasim by sea for full container loads, with air freight reserved for smaller, higher-value retail-packaged orders where transit time matters more than per-kilogram freight cost.</p>

<h2>Common Mistakes First-Time Importers Make</h2>
<p>The most frequent one is quoting a retail price per kilogram against a bulk order and being surprised when the wholesale number doesn't scale down proportionally — freight, packaging, and minimum processing costs don't disappear just because the order is larger. The second is under-specifying grade and mesh size and then rejecting a shipment that technically matched the (too-vague) order description. The third is skipping the certificate of analysis request entirely on a first order because the relationship feels informal — worth asking for regardless of order size, since it costs the buyer nothing and the supplier little to provide.</p>

<img src="${g[2]}" alt="Shipping containers loaded at a commercial port terminal" />

<h2>Conclusion</h2>
<p>Buying Himalayan pink salt at wholesale volume is a straightforward process once a buyer knows which variables actually move price and lead time — grade and mesh size, packaging format, and whether retail-ready finishing is done at origin or domestically. Ask for a real certificate of analysis, expect natural color variation rather than uniform pink across every piece, and size the order against realistic MOQs and lead times rather than retail-shelf pricing, and a first container-load order goes about as smoothly as it should.</p>
`.trim(),
  },
  {
    title: "Sodium vs. Calcium Bentonite: Which Type Does Your Industry Actually Need",
    excerpt:
      "Sodium and calcium bentonite come from the same mineral family and get used almost interchangeably in casual conversation — but they perform differently, and picking the wrong one wastes money in both directions. Here's a straight recommendation by industry.",
    category: "Industrial Minerals",
    tags: ["sodium bentonite vs calcium bentonite", "bentonite type comparison", "choosing bentonite grade"],
    metaTitle: "Sodium vs. Calcium Bentonite: Which One Do You Need? | Lumina Earth Minerals",
    metaDescription:
      "A straight, opinionated comparison of sodium bentonite vs calcium bentonite by industry — drilling, piling, foundry, pet litter, and clarification — with a real recommendation for each.",
    keywords: ["sodium bentonite vs calcium bentonite", "bentonite type comparison", "choosing bentonite grade"],
    isFeatured: true,
    coverImageUrl: "https://images.pexels.com/photos/944008/pexels-photo-944008.jpeg",
    galleryImageUrls: [
      "https://images.pexels.com/photos/20259603/pexels-photo-20259603.jpeg",
      "https://images.pexels.com/photos/26651061/pexels-photo-26651061.jpeg",
      "https://images.pexels.com/photos/9243563/pexels-photo-9243563.jpeg",
    ],
    galleryCaptions: [
      "A large drilling rig in operation at an industrial site",
      "Bulk bags of processed material ready for distribution",
      "Mineral samples being examined and tested in a laboratory setting",
    ],
    buildContent: (g) => `
<p>Ask three different bentonite buyers what the difference between sodium and calcium bentonite actually is, and you'll typically get three different half-answers — one about swelling, one about color, one that just says "sodium is the better one." That last answer is wrong often enough to cost real money. Sodium bentonite isn't a universally superior product; it's a specialized one, and specifying it for a job that calcium bentonite would handle just as well is a common, avoidable way to overpay. Here's the actual difference, and a straight recommendation by industry rather than a hedge.</p>

<img src="${g.cover}" alt="Large industrial construction and mining site" />

<h2>The Mineralogical Difference</h2>
<p>Both are montmorillonite clays — the distinction is which cation dominates the exchange sites on the clay's crystal structure. Sodium bentonite has sodium ions occupying most of those sites; calcium bentonite has calcium (and often some magnesium) instead. That single difference in exchangeable cation drives almost everything else that separates the two products in practice, because sodium ions hydrate with a much thicker water shell than calcium ions do, which changes how far apart the clay platelets push when water gets between them.</p>

<h2>Swelling Behavior: Why Sodium Wins on Volume</h2>
<p>Sodium bentonite can swell to many times its dry volume in water and remains dispersed as an extremely fine colloidal suspension. Calcium bentonite swells too, but far less dramatically — often only a fraction of sodium bentonite's swell volume — and tends to flocculate into looser aggregates rather than staying as finely dispersed. In practice, this means sodium bentonite builds usable viscosity at a much lower dosage than calcium bentonite does, which is the entire reason it costs more and the entire reason it's worth that premium in applications where high swell and low dosage actually matter.</p>

<h2>Where Sodium Bentonite Is the Right Call</h2>
<p>I'll say this plainly rather than hedge it: in any application where the fluid needs to gel, seal, or hold a hydrostatic column with a small quantity of clay, sodium bentonite is worth its higher price, and substituting calcium bentonite there is a false economy that shows up as underperformance on-site, not savings on paper.</p>

<h3>Drilling Fluids</h3>
<p>Oil and gas drilling mud, and higher-spec water well applications, need the viscosity-building and filtration-control performance that only sodium-activated bentonite delivers reliably at standard dosage rates. Trying to hit the same rheology with calcium bentonite means dosing far more product per cubic metre of mud, which usually erases any per-tonne cost advantage calcium bentonite might have offered.</p>

<h3>Piling and Diaphragm Walls</h3>
<p>Slurry-supported excavation depends on the filter cake and hydrostatic pressure that sodium (or well-activated) bentonite forms reliably at 4 to 6 percent mix ratios. Underperforming slurry here isn't a minor inconvenience — it's a borehole collapse risk, which makes this a poor place to economize on clay grade.</p>

<h3>Landfill Liners and Geosynthetic Clay Liners</h3>
<p>Containment barriers rely on extremely low hydraulic conductivity, and sodium bentonite's high swell capacity is what gets a compacted liner or geosynthetic clay liner down into the range regulators actually require. Calcium bentonite liners exist and are used in lower-stakes applications, but where a permeability standard has to be met and verified, sodium bentonite is the more defensible specification.</p>

<img src="${g[0]}" alt="A large drilling rig in operation at an industrial site" />

<h2>Where Calcium Bentonite Is the Right Call</h2>
<p>Equally plainly: in a handful of well-established applications, calcium bentonite isn't a compromise choice — it's the better-performing material, and specifying sodium bentonite there wastes money without buying anything the job actually needs.</p>

<h3>Foundry Sand Binder</h3>
<p>Green sand molding in metal casting uses bentonite as a binder to hold sand together under the heat and mechanical stress of pouring molten metal. Calcium bentonite's lower swell and different rheology actually suit this application well, and a meaningful share of foundry-grade product is calcium bentonite or a calcium-sodium blend rather than pure sodium — high swell isn't the property this job is selecting for.</p>

<h3>Animal Feed Pelleting and Cat Litter</h3>
<p>Cat litter is the application most people actually associate with bentonite without knowing it, and the clumping varieties on the market are overwhelmingly sodium bentonite specifically because high swell and strong clump cohesion are exactly what that product needs. Non-clumping litter and animal feed pelleting binders, on the other hand, more commonly use calcium bentonite, where moderate absorbency without excessive swelling is the better fit and the lower cost per tonne matters at the volumes feed mills consume.</p>

<h3>Decolorizing and Clarifying Applications</h3>
<p>Acid-activated calcium bentonite is the workhorse behind decolorizing clays used in edible oil refining and mineral oil processing, where its adsorptive surface area — not its swelling capacity — is the property being selected for. Sodium bentonite isn't typically used here at all; it's simply the wrong tool for an adsorption job.</p>

<img src="${g[1]}" alt="Bulk bags of processed material ready for distribution" />

<h2>Activated Calcium Bentonite: A Middle Ground</h2>
<p>Soda-ash-activated calcium bentonite — calcium ore treated to exchange calcium for sodium on the clay surface — closes a meaningful part of the performance gap with natural sodium bentonite, and it's what most commercial "sodium bentonite" on the market actually is, since naturally sodium-dominant deposits are geologically less common than calcium-dominant ones. Well-activated material performs close enough to natural sodium bentonite for most drilling and piling applications; the honest caveat is that activation quality varies meaningfully between processors, and a buyer comparing two "sodium bentonite" quotes at very different prices should ask directly whether the product is natural or activated, and, if activated, what dosage and cure time the supplier runs.</p>

<h2>My Recommendation by Industry</h2>
<p>If I'm advising a buyer directly rather than surveying the options, here's where I land: specify natural or well-activated sodium bentonite for drilling fluids, piling and diaphragm wall slurry, and containment liners, full stop — these are load-bearing, safety-relevant applications where underperformance has real consequences, and the cost premium is justified. Specify calcium bentonite for foundry sand binding, non-clumping animal litter and feed applications, and any adsorption or decolorizing use — sodium bentonite buys nothing extra there and costs more for the privilege. And if a supplier quotes you a single "bentonite" product for both a drilling program and a foundry binder order without asking which application it's for, that's worth treating as a signal to ask more questions, not a sign of a flexible, one-size-fits-all product.</p>

<img src="${g[2]}" alt="Mineral samples being examined and tested in a laboratory setting" />

<h2>Conclusion</h2>
<p>Sodium and calcium bentonite share a mineral name and not much else in terms of which jobs they're actually suited for. The difference comes down to one exchangeable cation and the swelling behavior it drives, but the practical consequence is real money either overspent or underperformed against. Match the grade to what the application is actually selecting for — high swell and low dosage, or moderate absorbency and surface area — and the choice stops being a coin flip and starts being an engineering decision.</p>
`.trim(),
  },
];

const fetchAsBlob = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/jpeg";
  return new Blob([arrayBuffer], { type: contentType });
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB (for admin lookup only — creation goes through the HTTP API)");

  const admin = await User.findOne({ role: "admin" });
  if (!admin) throw new Error("No admin user found — cannot authenticate against the API");

  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log(`Authenticated as admin: ${admin.email}`);

  await mongoose.disconnect();

  const results = [];

  for (const spec of ARTICLES) {
    console.log(`\n--- Creating: ${spec.title} ---`);

    const [coverBlob, gallery1Blob, gallery2Blob, gallery3Blob] = await Promise.all([
      fetchAsBlob(spec.coverImageUrl),
      fetchAsBlob(spec.galleryImageUrls[0]),
      fetchAsBlob(spec.galleryImageUrls[1]),
      fetchAsBlob(spec.galleryImageUrls[2]),
    ]);

    // Build content with placeholder src markers, then patch in real Cloudinary
    // URLs after the API responds with the uploaded image data (two-step: the
    // API generates the Cloudinary URLs, so gallery <img> tags reference them
    // by position after creation via a follow-up PUT).
    const placeholderContent = spec.buildContent({
      cover: "__COVER__",
      0: "__GALLERY_0__",
      1: "__GALLERY_1__",
      2: "__GALLERY_2__",
    });

    const form = new FormData();
    form.append("title", spec.title);
    form.append("excerpt", spec.excerpt);
    form.append("content", placeholderContent);
    form.append("category", spec.category);
    form.append("status", "published");
    form.append("isFeatured", String(spec.isFeatured));
    form.append("tags", spec.tags.join(","));
    form.append("metaTitle", spec.metaTitle);
    form.append("metaDescription", spec.metaDescription);
    form.append("keywords", spec.keywords.join(","));
    form.append("coverImage", coverBlob, "cover.jpg");
    form.append("gallery", gallery1Blob, "gallery1.jpg");
    form.append("gallery", gallery2Blob, "gallery2.jpg");
    form.append("gallery", gallery3Blob, "gallery3.jpg");

    const createRes = await fetch(`${API_BASE}/api/articles`, {
      method: "POST",
      headers: { Cookie: `token=${token}` },
      body: form,
    });

    const createJson = await createRes.json();
    if (!createRes.ok || !createJson.success) {
      console.error(`FAILED to create "${spec.title}":`, createRes.status, JSON.stringify(createJson));
      continue;
    }

    const created = createJson.article;
    console.log(`Created id=${created._id} slug=${created.slug} words=${created.wordCount}`);

    // Patch content with real Cloudinary URLs now that we have them.
    const realContent = spec.buildContent({
      cover: created.coverImage.url,
      0: created.gallery[0].url,
      1: created.gallery[1].url,
      2: created.gallery[2].url,
    });

    const patchForm = new FormData();
    patchForm.append("content", realContent);

    const patchRes = await fetch(`${API_BASE}/api/articles/${created._id}`, {
      method: "PUT",
      headers: { Cookie: `token=${token}` },
      body: patchForm,
    });
    const patchJson = await patchRes.json();
    if (!patchRes.ok || !patchJson.success) {
      console.error(`FAILED to patch content for "${spec.title}":`, patchRes.status, JSON.stringify(patchJson));
      continue;
    }

    console.log(`Patched content with real image URLs. Final wordCount=${patchJson.article.wordCount}`);
    results.push(patchJson.article);
  }

  console.log("\n=== SUMMARY ===");
  for (const a of results) {
    console.log(`${a.slug} | ${a.status} | words=${a.wordCount} | cover=${a.coverImage.url}`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
