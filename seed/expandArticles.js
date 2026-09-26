import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../modals/User.js";

dotenv.config();

const API_BASE = process.env.SEED_API_BASE || "http://localhost:4000";

// Additional HTML sections to insert before each article's <h2>Conclusion</h2>,
// added because the initial drafts landed under the 1500-word requirement.
const ADDITIONS = {
  "sourcing-bulk-sodium-bentonite-for-piling-contractors-dosage-specs-and-supplier-vetting": `
<h2>Freight, Incoterms, and Landed Cost</h2>
<p>Quoted price per tonne at the plant gate and landed cost at the job site are two different numbers, and contractors who compare supplier quotes on the first one alone are comparing incomplete figures. FOB (free on board) pricing puts the cost and risk of ocean freight, insurance, and destination port handling on the buyer; CFR (cost and freight) folds ocean freight into the quoted price but leaves insurance and destination charges separate; CIF (cost, insurance, and freight) bundles all three. None of these terms changes the bentonite itself, but they change who's exposed if freight rates spike between order confirmation and vessel loading — a real risk on a three-to-five-week lead time — and a contractor comparing two FOB quotes against one CIF quote without normalizing for that is comparing the wrong numbers.</p>
<h3>Bagged vs. Bulk Freight Economics</h3>
<p>Jumbo bags and small bags both waste container volume relative to their weight, since a standard 20-foot container maxes out around 24 to 26 tonnes of bagged bentonite well before it reaches the container's cubic capacity limit — the material is dense enough that weight, not volume, is usually the binding constraint. Bulk loose shipment in a bulk container or break-bulk vessel booking can push tonnage per container somewhat higher and cuts out bag cost entirely, but it only pays off if the receiving site has the silo and pneumatic or mechanical unloading equipment to handle it; without that, the saved freight cost gets spent right back on an improvised, slower manual unload.</p>
<h3>Payment Terms and Currency Risk</h3>
<p>Most export bentonite orders move on a mix of advance telegraphic transfer and balance against shipping documents, or a letter of credit for larger first-time orders where neither party has an established payment history yet. An LC costs more in bank fees but shifts non-payment and non-delivery risk onto the banks rather than either party's trust in the other, which is usually worth it on a first order above a certain size even though it adds a few days of documentation lead time on both ends.</p>
`.trim(),

  "how-oil-grade-bentonite-is-processed-differently-from-other-grades": `
<h2>Additives and Blending</h2>
<p>Not every oil-grade shipment is unblended bentonite straight off the mill. Mud engineers on some programs specify a pre-blended product incorporating small percentages of polymer extenders — typically synthetic or natural polymers that boost viscosity yield per tonne of clay — allowing a processor to hit a target rheology using less raw bentonite, which can matter on projects where freight cost per tonne outweighs raw material cost. Extended bentonite products are usually sold and priced as a distinct line rather than blended into standard oil-grade stock without disclosure, since a buyer who isn't expecting a polymer-extended product can get thrown off by a yield number that looks unusually strong for the stated montmorillonite content.</p>
<h3>Why Disclosure Matters More Than the Blend Itself</h3>
<p>There's nothing wrong with a properly disclosed extended product — it's a legitimate, widely used category, and it can be the more cost-effective choice on a large program. The problem is a supplier who blends in extenders without stating it on the spec sheet, because a buyer re-trialing mix ratios against an undisclosed blend is calibrating against numbers that won't repeat if a later shipment reverts to unblended stock. Any COA or spec sheet for oil-grade material should state plainly whether the product is straight sodium-activated bentonite or an extended blend, and if it's the latter, what the extender is and at what percentage.</p>
<h3>Barite and Weighting Agents: A Separate Product Entirely</h3>
<p>It's worth flagging a common point of buyer confusion here: weighting agents like barite, used to increase mud density for high-pressure formations, are a completely separate additive from bentonite and serve a different function — density control rather than viscosity and filtration control. The two are sometimes ordered together for the same drilling program but should never be treated as interchangeable or substitutable line items on a purchase order.</p>
<h3>Third-Party Verification for Large Programs</h3>
<p>On multi-well drilling programs, some operators require an independent third-party lab to verify the supplier's own COA numbers on a sampling basis rather than relying solely on the mill's internal testing. This adds cost and a few days to the qualification process, but for a program running hundreds of tonnes over multiple months, the cost of independent verification is small next to the cost of discovering a systemic quality issue only after several wells have already been drilled on an underperforming batch.</p>
`.trim(),

  "water-grade-bentonite-quality-control-what-to-check-on-a-certificate-of-analysis": `
<h2>Storage and Shelf Life Before Use</h2>
<p>A certificate of analysis reflects the material's condition at the point it was tested, not necessarily its condition by the time it reaches a wellhead months later, and storage conditions between those two points matter more for water-grade bentonite than buyers usually assume. Bagged product stored in a humid yard or under a leaking tarp can pick up ambient moisture well above its original COA figure, and because bentonite is hygroscopic by nature, that absorption happens gradually and invisibly from the outside of an intact bag.</p>
<h3>Signs of Degraded Storage</h3>
<p>Bags that feel noticeably heavier than their stated weight, or that have begun to harden or cake at the corners, have usually taken on moisture and should be re-tested for swell index before use rather than assumed to still match the original certificate. Product stored for more than roughly six to twelve months, even under good conditions, is worth spot-checking again before a large well program, simply because the cost of a quick re-test is trivial next to the cost of discovering a swell index problem mid-drill.</p>
<h3>What a Reasonable Storage Spec Looks Like</h3>
<p>For a buyer taking delivery ahead of a drilling season rather than using material immediately, it's worth specifying dry, covered, palletized storage off the ground in the purchase agreement, and confirming with the supplier or freight forwarder that the product wasn't exposed to open weather at any transfer point between the mill and final delivery. None of this is unusual or burdensome to ask for — it's the same basic handling most bagged construction materials need, but it's worth stating rather than assuming a supplier or trucking contractor will default to it.</p>
<h3>Retesting Cadence for Standing Inventory</h3>
<p>For utilities or drilling contractors who keep a standing inventory rather than ordering just-in-time per well, building a retesting cadence into internal procurement policy — for example, a swell index and moisture recheck every quarter for stored inventory — catches degradation early enough to still return or downgrade affected stock rather than discovering the problem mid-well when the only option left is to work around it.</p>
`.trim(),

  "himalayan-pink-salt-wholesale-a-guide-for-bulk-buyers-and-importers": `
<h2>Import Documentation and Compliance</h2>
<p>Beyond the certificate of analysis, most destination markets require a specific paper trail before a food-grade salt shipment clears customs, and gathering these documents after the container has already sailed is a common source of costly port delays. A phytosanitary or health certificate, a certificate of origin, a packing list matching the actual carton or bag count, and — for several import markets — a halal or kosher certification if the buyer's downstream customers require it, are worth confirming as available before the order is placed, not after.</p>
<h3>Labeling Requirements Vary by Market</h3>
<p>Retail-ready packaging done at origin needs to match the destination market's labeling law, not the exporter's home market defaults — nutritional declaration formats, language requirements, and net-weight disclosure rules differ enough between import markets that a label proofed for one market can fail inspection in another. Buyers importing retail-ready product should send the exact label artwork and get supplier sign-off before production runs, rather than relying on a generic "food-grade label" assurance.</p>
<h3>Country-Specific Import Permits</h3>
<p>Some markets require a specific import permit or product registration for salt intended for human consumption, separate from general customs clearance, and the lead time to secure that registration can run longer than the shipping lead time itself on a first order into a new market. It's worth starting that process in parallel with supplier negotiations rather than after a container is already booked.</p>
<h3>Working With a Freight Forwarder Familiar With Food Imports</h3>
<p>A freight forwarder who regularly handles food-grade imports into your specific destination market is worth the modest extra cost over a general cargo forwarder, since they'll typically flag missing documentation before a container ships rather than after it's already sitting in a customs hold accruing demurrage charges.</p>
<h2>How Himalayan Salt Compares to Other Bulk Rock Salt</h2>
<p>Buyers evaluating cost sometimes ask why Himalayan pink salt commands a premium over other rock salt sources used for similar applications, since sodium chloride is sodium chloride regardless of where it's mined. The honest answer is mostly about trace mineral content, color, and brand positioning rather than any meaningful functional difference in most food applications — Himalayan pink salt typically carries a slightly lower sodium chloride purity than highly refined industrial rock salt precisely because it retains more trace minerals and isn't stripped down to pure NaCl, which is the same characteristic that gives it both its color and its market position as a specialty product.</p>
<h3>When the Premium Is Justified</h3>
<p>For buyers targeting retail and specialty food markets where the Himalayan brand name and natural mineral positioning drive consumer demand, the premium is straightforwardly justified by what it sells for on the shelf. For buyers purchasing salt purely as a functional ingredient — de-icing, industrial water softening, or bulk food processing where the end consumer never sees the source — a lower-cost refined rock salt from a closer or less specialty-branded source may be the more rational purchase, and it's worth being honest about which category an order actually falls into rather than upselling a specialty product where it isn't needed.</p>
`.trim(),

  "sodium-vs-calcium-bentonite-which-type-does-your-industry-actually-need": `
<h2>How to Verify Which Type You're Actually Buying</h2>
<p>Labels on a spec sheet are easy to print and not always reliable, particularly in a market where "sodium bentonite" gets used loosely to describe anything that's been through any degree of soda ash treatment. If the distinction actually matters for your application — and for the load-bearing uses covered above, it does — there are a few straightforward ways to verify what you're actually buying rather than taking a supplier's label at face value.</p>
<h3>Free Swell Test</h3>
<p>The simplest field-verifiable check is a free swell test: a small measured quantity of dry bentonite added to a graduated cylinder of water, with the settled volume read after 24 hours. Natural or well-activated sodium bentonite typically swells to a noticeably larger settled volume per gram than calcium bentonite, and while this test doesn't give a precise cation breakdown, it's a fast, cheap way to flag material that doesn't match its label before it's mixed into a full batch.</p>
<h3>Cation Exchange Capacity and Exchangeable Sodium Percentage</h3>
<p>For a more rigorous check, a lab can run a cation exchange capacity (CEC) test alongside an exchangeable sodium percentage (ESP) measurement, which directly quantifies what fraction of the clay's exchange sites are actually occupied by sodium versus calcium and magnesium. This is the number that settles the question definitively rather than inferring it from swell behavior alone, and it's worth requesting on any large order where the price gap between the sodium and calcium quotes seems too small to be believable.</p>
<h3>Viscosity Yield at Standard Dosage</h3>
<p>For drilling and piling buyers specifically, the most practically relevant verification is simply mixing a trial batch at the specified dosage rate and checking Marsh funnel viscosity against the number on the spec sheet before committing to a full program order. A material correctly labeled as sodium bentonite that can't build spec viscosity at standard dosage is a processing or activation problem worth catching in a bucket test, not on a live rig.</p>
<h3>Watch for Blended Products</h3>
<p>Some suppliers sell a sodium-calcium blend rather than a pure product of either type, positioned as a lower-cost middle option. There's a legitimate market for this in some general-purpose construction applications, but it should be sold and priced as a blend, not marketed under either pure designation. A blend's swell and CEC numbers should sit visibly between typical sodium and calcium figures rather than matching either extreme, which is itself a useful sanity check when reviewing a certificate.</p>
`.trim(),
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ role: "admin" });
  if (!admin) throw new Error("No admin user found");
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  await mongoose.disconnect();

  for (const [slug, addition] of Object.entries(ADDITIONS)) {
    const getRes = await fetch(`${API_BASE}/api/articles/${slug}`, { headers: { Cookie: `token=${token}` } });
    const getJson = await getRes.json();
    if (!getRes.ok || !getJson.success) {
      console.error(`FAILED to fetch "${slug}":`, getRes.status, JSON.stringify(getJson));
      continue;
    }
    const article = getJson.article;

    if (!article.content.includes("<h2>Conclusion</h2>")) {
      console.error(`No <h2>Conclusion</h2> marker found in "${slug}" — skipping`);
      continue;
    }

    const newContent = article.content.replace("<h2>Conclusion</h2>", `${addition}\n\n<h2>Conclusion</h2>`);

    const patchForm = new FormData();
    patchForm.append("content", newContent);

    const putRes = await fetch(`${API_BASE}/api/articles/${article._id}`, {
      method: "PUT",
      headers: { Cookie: `token=${token}` },
      body: patchForm,
    });
    const putJson = await putRes.json();
    if (!putRes.ok || !putJson.success) {
      console.error(`FAILED to patch "${slug}":`, putRes.status, JSON.stringify(putJson));
      continue;
    }

    console.log(`${slug}: ${article.wordCount} -> ${putJson.article.wordCount} words`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error("Expand failed:", err);
  process.exit(1);
});
