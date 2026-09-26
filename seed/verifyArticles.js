const API_BASE = process.env.SEED_API_BASE || "http://localhost:4000";

const SLUGS = [
  "sourcing-bulk-sodium-bentonite-for-piling-contractors-dosage-specs-and-supplier-vetting",
  "how-oil-grade-bentonite-is-processed-differently-from-other-grades",
  "water-grade-bentonite-quality-control-what-to-check-on-a-certificate-of-analysis",
  "himalayan-pink-salt-wholesale-a-guide-for-bulk-buyers-and-importers",
  "sodium-vs-calcium-bentonite-which-type-does-your-industry-actually-need",
];

const run = async () => {
  for (const slug of SLUGS) {
    const res = await fetch(`${API_BASE}/api/articles/${slug}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      console.log(`${slug}: FETCH FAILED (${res.status})`);
      continue;
    }
    const a = json.article;
    let coverStatus = "ERR";
    try {
      const r = await fetch(a.coverImage.url, { method: "HEAD" });
      coverStatus = r.status;
    } catch (e) {
      coverStatus = `error: ${e.message}`;
    }
    console.log(`${slug}`);
    console.log(`  status=${a.status} words=${a.wordCount} readTime=${a.readTime}min gallery=${a.gallery.length}`);
    console.log(`  cover=${a.coverImage.url} (HTTP ${coverStatus})`);
    console.log(`  opening: ${a.content.replace(/<[^>]*>/g, " ").trim().slice(0, 260)}...`);
    console.log("");
  }
};

run();
