import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const today = new Date();
const dayOfWeek = today.getDay();

const currentWeekMonday = new Date(today);
currentWeekMonday.setDate(
  today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
);
currentWeekMonday.setHours(0, 0, 0, 0);

const lastWeekMonday = new Date(currentWeekMonday);
lastWeekMonday.setDate(currentWeekMonday.getDate() - 7);

const lastWeekSunday = new Date(currentWeekMonday);
lastWeekSunday.setDate(currentWeekMonday.getDate() - 1);

const firstDayOfLastMonth = new Date(
  today.getFullYear(),
  today.getMonth() - 1,
  1,
);
const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

function randomDate(start, end) {
  const time =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(time).toISOString().split("T")[0];
}

function randomAmount() {
  return Math.floor(Math.random() * 45001) + 5000;
}

const dealTitles = [
  "Enterprise License",
  "Annual Software",
  "Cloud Migration",
  "Support & Maintenance",
  "Professional Services",
  "Platform Expansion",
  "Partnership Integration",
  "Managed Services",
  "Renewal & Upgrade",
  "Strategic Growth",
  "Global Expansion",
  "Q2 Retainer",
  "Infrastructure Overhaul",
  "Digital Transformation",
  "Security Audit",
  "Data Analytics",
  "Compliance Framework",
  "Training & Onboarding",
  "SLA Premium",
  "Product Rollout",
];

function shuffleTitles() {
  return [...dealTitles].sort(() => Math.random() - 0.5);
}

async function seed() {
  const { data: reps, error } = await supabase
    .from("profiles")
    .select("id, division_id")
    .eq("role", "rep");

  if (error) {
    console.error("Failed to fetch reps:", error.message);
    return;
  }

  console.log(`Found ${reps.length} reps. Seeding sales...\n`);

  for (const rep of reps) {
    const securedRatio = 0.5 + Math.random() * 0.35;
    const titles = shuffleTitles();
    const sales = [];

    for (let i = 0; i < 5; i++) {
      sales.push({
        rep_id: rep.id,
        division_id: rep.division_id,
        amount: randomAmount(),
        title: titles[i],
        status: Math.random() < securedRatio ? "secured" : "lost",
        closing_date: randomDate(currentWeekMonday, today),
      });
    }

    for (let i = 0; i < 5; i++) {
      sales.push({
        rep_id: rep.id,
        division_id: rep.division_id,
        amount: randomAmount(),
        title: titles[5 + i],
        status: Math.random() < securedRatio ? "secured" : "lost",
        closing_date: randomDate(lastWeekMonday, lastWeekSunday),
      });
    }

    for (let i = 0; i < 10; i++) {
      sales.push({
        rep_id: rep.id,
        division_id: rep.division_id,
        amount: randomAmount(),
        title: titles[10 + i],
        status: Math.random() < securedRatio ? "secured" : "lost",
        closing_date: randomDate(firstDayOfLastMonth, lastDayOfLastMonth),
      });
    }

    const { error: insertError } = await supabase.from("sales").insert(sales);

    if (insertError) {
      console.error(
        `Failed to insert sales for rep ${rep.id}:`,
        insertError.message,
      );
    } else {
      console.log(`[REP] ${rep.id} — ${sales.length} sales inserted`);
    }
  }

  console.log("\nSeeding complete.");
}

seed();
