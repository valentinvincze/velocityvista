import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const divisions = [
  { name: "Enterprise Solutions", id: "7a3b5843-8330-4ab7-acab-efd662b9edf1" },
  { name: "B2B Channel", id: "98f69820-3f87-44d1-9a1c-ad41545cc814" },
  { name: "Strategic Accounts", id: "c81a9f4b-7559-4494-8523-09dccb8ede0f" },
  { name: "Global Partnerships", id: "d9bf6f5a-cc6f-49b5-9a81-4a13d12bf508" },
  { name: "Consumer Products", id: "f2e78f66-541f-4cf1-bdf0-14014f95bf67" },
];

const firstNames = [
  "James",
  "Emma",
  "Oliver",
  "Sophia",
  "Liam",
  "Ava",
  "Noah",
  "Isabella",
  "Ethan",
  "Mia",
  "Mason",
  "Charlotte",
  "Logan",
  "Amelia",
  "Lucas",
];

const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Davis"];

let nameIndex = 0;

function nextName() {
  const first = firstNames[nameIndex % firstNames.length];
  const last = lastNames[Math.floor(nameIndex / firstNames.length)];
  nameIndex++;
  return { first, last };
}

async function createUser({ email, fullName, role, divisionId, jobTitle }) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: "Velocityvista123!",
    email_confirm: true,
    user_metadata: {
      role,
      division_id: divisionId,
      full_name: fullName,
      job_title: jobTitle,
    },
  });

  if (error) {
    console.error(`Failed to create ${email}:`, error.message);
    return;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    job_title: jobTitle,
    role,
    division_id: divisionId,
  });

  if (profileError) {
    console.error(`Profile upsert failed for ${email}:`, profileError.message);
  } else {
    console.log(`[${role.toUpperCase()}] ${fullName} — ${email}`);
  }
}

async function seed() {
  for (const division of divisions) {
    console.log(`\n${division.name}`);

    for (let i = 0; i < 5; i++) {
      const { first, last } = nextName();
      await createUser({
        email: `${first.toLowerCase()}.${last.toLowerCase()}@velocityv.com`,
        fullName: `${first} ${last}`,
        role: "admin",
        divisionId: division.id,
        jobTitle: "Administrator",
      });
    }

    for (let i = 0; i < 10; i++) {
      const { first, last } = nextName();
      await createUser({
        email: `${first.toLowerCase()}.${last.toLowerCase()}@velocityv.com`,
        fullName: `${first} ${last}`,
        role: "rep",
        divisionId: division.id,
        jobTitle: "Sales Rep",
      });
    }
  }

  console.log("\nSeeding complete.");
}

seed();
