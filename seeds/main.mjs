import { universitySeeder } from "./university.mjs";

async function main(){
    await universitySeeder();
}


main().then(()=>  { console.log("Success Seeding") } )
.catch(err=> console.error(err))