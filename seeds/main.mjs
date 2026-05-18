import { createAdmin } from "./create_admin.mjs";
import { universitySeeder } from "./university.mjs";

async function main() {
    await universitySeeder();
    // await createAdmin();
}


main().then(() => { console.log("Success Seeding") })
    .catch(err => console.error(err))

