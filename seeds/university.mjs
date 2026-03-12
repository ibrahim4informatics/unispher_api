import { PrismaClient, AcademicSystem, DegreeCycle } from "@prisma/client"

const prisma = new PrismaClient()

/* ------------------ LEVEL GENERATORS ------------------ */

async function createLMDLevels(fieldId) {
    const levels = ["L1", "L2", "L3", "M1", "M2"]

    for (let i = 0; i < levels.length; i++) {
        await prisma.level.create({
            data: {
                name: levels[i],
                cycle: i < 3 ? DegreeCycle.LICENSE : DegreeCycle.MASTER,
                is_final: i === 2 || i === 4,
                field_id: fieldId
            }
        })
    }
}

async function createEngineeringLevels(fieldId) {
    for (let i = 1; i <= 5; i++) {
        await prisma.level.create({
            data: {
                name: `Engineering Year ${i}`,
                cycle: DegreeCycle.ENGINEERING,
                is_final: i === 5,
                field_id: fieldId
            }
        })
    }
}

async function createMedicineLevels(fieldId) {
    for (let i = 1; i <= 6; i++) {
        await prisma.level.create({
            data: {
                name: `Medicine Year ${i}`,
                cycle: DegreeCycle.CLASSIC,
                is_final: i === 6,
                field_id: fieldId
            }
        })
    }
}

/* ------------------ FIELD CREATOR ------------------ */

async function createField(departmentId, name, code, system) {

    const field = await prisma.field.create({
        data: {
            name,
            code,
            academic_system: system,
            department_id: departmentId
        }
    })

    if (system === AcademicSystem.LMD)
        await createLMDLevels(field.id)

    if (system === AcademicSystem.ENG)
        await createEngineeringLevels(field.id)

    if (system === AcademicSystem.CLASSIC)
        await createMedicineLevels(field.id)
}

/* ------------------ DATASETS ------------------ */

const universities = [
    { name: "USTHB", city: "Algiers" },
    { name: "University of Algiers 1", city: "Algiers" },
    { name: "University of Algiers 2", city: "Algiers" },
    { name: "University of Algiers 3", city: "Algiers" },
    { name: "University of Oran 1", city: "Oran" },
    { name: "University of Oran 2", city: "Oran" },
    { name: "University of Constantine 1", city: "Constantine" },
    { name: "University of Constantine 2", city: "Constantine" },
    { name: "University of Annaba", city: "Annaba" },
    { name: "University of Tlemcen", city: "Tlemcen" },
    { name: "University of Bejaia", city: "Bejaia" },
    { name: "University of Blida 1", city: "Blida" },
    { name: "University of Batna 1", city: "Batna" },
    { name: "University of Setif 1", city: "Setif" },
    { name: "University of Tizi Ouzou", city: "Tizi Ouzou" }
]

const scienceFields = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology"
]

const engineeringFields = [
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Industrial Engineering",
    "Telecommunications Engineering",
    "Computer Engineering"
]

const economicsFields = [
    "Economics",
    "Management",
    "Finance",
    "Accounting",
    "Marketing"
]

const humanitiesFields = [
    "History",
    "Geography",
    "Philosophy",
    "Sociology",
    "Psychology"
]

const languageFields = [
    "Arabic Language",
    "French Language",
    "English Language",
    "Spanish Language"
]

const medicineFields = [
    "Medicine",
    "Pharmacy",
    "Dentistry"
]

/* ------------------ SEED LOGIC ------------------ */

export async function universitySeeder() {

    try {
        for (const uni of universities) {

            const university = await prisma.university.create({
                data: {
                    name: uni.name,
                    short_name: uni.name,
                    city: uni.city
                }
            })

            /* -------- EXACT SCIENCES FACULTY -------- */

            const scienceFaculty = await prisma.faculty.create({
                data: {
                    name: "Faculty of Exact Sciences",
                    code: "FES",
                    university_id: university.id
                }
            })

            const scienceDept = await prisma.department.create({
                data: {
                    name: "Exact Sciences Department",
                    code: "SCI",
                    faculty_id: scienceFaculty.id,
                    university_id: university.id
                }
            })

            for (const field of scienceFields)
                await createField(scienceDept.id, field, field.slice(0, 3).toUpperCase(), AcademicSystem.LMD)

            /* -------- ENGINEERING FACULTY -------- */

            const engFaculty = await prisma.faculty.create({
                data: {
                    name: "Faculty of Engineering",
                    code: "ENG",
                    university_id: university.id
                }
            })

            const engDept = await prisma.department.create({
                data: {
                    name: "Engineering Department",
                    code: "ENG",
                    faculty_id: engFaculty.id,
                    university_id: university.id
                }
            })

            for (const field of engineeringFields)
                await createField(engDept.id, field, field.slice(0, 3).toUpperCase(), AcademicSystem.ENG)

            /* -------- MEDICINE FACULTY -------- */

            const medFaculty = await prisma.faculty.create({
                data: {
                    name: "Faculty of Medicine",
                    code: "MED",
                    university_id: university.id
                }
            })

            const medDept = await prisma.department.create({
                data: {
                    name: "Medical Sciences Department",
                    code: "MED",
                    faculty_id: medFaculty.id,
                    university_id: university.id
                }
            })

            for (const field of medicineFields)
                await createField(medDept.id, field, field.slice(0, 3).toUpperCase(), AcademicSystem.CLASSIC)

            /* -------- ECONOMICS FACULTY -------- */

            const ecoFaculty = await prisma.faculty.create({
                data: {
                    name: "Faculty of Economics",
                    code: "ECO",
                    university_id: university.id
                }
            })

            const ecoDept = await prisma.department.create({
                data: {
                    name: "Economics Department",
                    code: "ECO",
                    faculty_id: ecoFaculty.id,
                    university_id: university.id
                }
            })

            for (const field of economicsFields)
                await createField(ecoDept.id, field, field.slice(0, 3).toUpperCase(), AcademicSystem.LMD)

            /* -------- HUMANITIES FACULTY -------- */

            const humFaculty = await prisma.faculty.create({
                data: {
                    name: "Faculty of Humanities",
                    code: "HUM",
                    university_id: university.id
                }
            })

            const humDept = await prisma.department.create({
                data: {
                    name: "Humanities Department",
                    code: "HUM",
                    faculty_id: humFaculty.id,
                    university_id: university.id
                }
            })

            for (const field of humanitiesFields)
                await createField(humDept.id, field, field.slice(0, 3).toUpperCase(), AcademicSystem.LMD)

            /* -------- LANGUAGES FACULTY -------- */

            const langFaculty = await prisma.faculty.create({
                data: {
                    name: "Faculty of Languages",
                    code: "LAN",
                    university_id: university.id
                }
            })

            const langDept = await prisma.department.create({
                data: {
                    name: "Languages Department",
                    code: "LAN",
                    faculty_id: langFaculty.id,
                    university_id: university.id
                }
            })

            for (const field of languageFields)
                await createField(langDept.id, field, field.slice(0, 3).toUpperCase(), AcademicSystem.LMD)

        }

        console.log("Algerian university dataset seeded successfully")
    }

    catch (err) {
        console.error(err);
        await prisma.$disconnect();
    }
}

