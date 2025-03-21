import postgres from "postgres";

import { heroes } from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!);

// Check if the connection to the database is successful
sql`SELECT 1`
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

async function resetDatabase() {
    await sql`DROP TABLE IF EXISTS HeroCities CASCADE`;
    await sql`DROP TABLE IF EXISTS VillainCities CASCADE`;
    await sql`DROP TABLE IF EXISTS Battles CASCADE`;
    await sql`DROP TABLE IF EXISTS HeroPowers CASCADE`;
    await sql`DROP TABLE IF EXISTS VillainPowers CASCADE`;
    await sql`DROP TABLE IF EXISTS Heroes CASCADE`;
    await sql`DROP TABLE IF EXISTS Villains CASCADE`;
    await sql`DROP TABLE IF EXISTS Powers CASCADE`;
    await sql`DROP TABLE IF EXISTS Cities CASCADE`;
    await sql`DROP TABLE IF EXISTS Affiliations CASCADE`;
}

async function createTables() {
    // Create ENUM type for affiliations
    await sql`DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'affiliation_type') THEN
            CREATE TYPE affiliation_type AS ENUM ('Hero', 'Villain', 'Neutral');
        END IF;
    END $$;`;

    await sql`CREATE TABLE IF NOT EXISTS Affiliations (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type affiliation_type NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS Heroes (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        alias VARCHAR(50),
        power VARCHAR(100),
        origin VARCHAR(100),
        bio TEXT,
        affiliation_id UUID,
        image_url VARCHAR(255),
        FOREIGN KEY (affiliation_id) REFERENCES Affiliations(id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS Villains (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        alias VARCHAR(50),
        power VARCHAR(100),
        origin VARCHAR(100),
        bio TEXT,
        affiliation_id UUID,
        image_url VARCHAR(255),
        FOREIGN KEY (affiliation_id) REFERENCES Affiliations(id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS Powers (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
    )`;

    await sql`CREATE TABLE IF NOT EXISTS HeroPowers (
        hero_id UUID,
        power_id UUID,
        PRIMARY KEY (hero_id, power_id),
        FOREIGN KEY (hero_id) REFERENCES Heroes(id),
        FOREIGN KEY (power_id) REFERENCES Powers(id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS VillainPowers (
        villain_id UUID,
        power_id UUID,
        PRIMARY KEY (villain_id, power_id),
        FOREIGN KEY (villain_id) REFERENCES Villains(id),
        FOREIGN KEY (power_id) REFERENCES Powers(id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS Battles (
        id UUID PRIMARY KEY,
        hero_id UUID,
        villain_id UUID,
        location VARCHAR(100),
        date DATE,
        outcome VARCHAR(50),
        FOREIGN KEY (hero_id) REFERENCES Heroes(id),
        FOREIGN KEY (villain_id) REFERENCES Villains(id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS Cities (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS HeroCities (
        hero_id UUID,
        city_id UUID,
        PRIMARY KEY (hero_id, city_id),
        FOREIGN KEY (hero_id) REFERENCES Heroes(id),
        FOREIGN KEY (city_id) REFERENCES Cities(id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS VillainCities (
        villain_id UUID,
        city_id UUID,
        PRIMARY KEY (villain_id, city_id),
        FOREIGN KEY (villain_id) REFERENCES Villains(id),
        FOREIGN KEY (city_id) REFERENCES Cities(id)
    )`;
}

async function seedData() {
    // Example seeding logic for Affiliations
    await sql`INSERT INTO Affiliations (id, name, type) VALUES (gen_random_uuid(), 'Justice League', 'Hero') ON CONFLICT DO NOTHING`;
    await sql`INSERT INTO Affiliations (id, name, type) VALUES (gen_random_uuid(), 'Legion of Doom', 'Villain') ON CONFLICT DO NOTHING`;

    // Seeding heroes from placeholder data
    for (const hero of heroes) {
        const id = hero.id || sql`gen_random_uuid()`;
        const name = hero.name || 'Unknown Hero';
        const bio = hero.bio || hero.description || 'No bio available';
        const imageUrl = hero.imageUrl || '/public/global/not-found.jpeg';

        await sql`INSERT INTO Heroes (id, name, alias, power, origin, affiliation_id, image_url, bio) VALUES (${id}, ${name}, null, null, null, null, ${imageUrl}, ${bio}) ON CONFLICT DO NOTHING`;
    }

    // Add more seeding logic for other tables as needed
}

export async function GET() {
    try {
        await sql.begin(async () => {
            await resetDatabase();
            await createTables();
            await seedData();
        });

        return new Response(null, {
            status: 302,
            headers: {
                Location: '/seed/success',
            },
        });
    } catch (error) {
        console.error('Error resetting and seeding database:', error);
        return new Response(JSON.stringify({ message: 'Error resetting and seeding database' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}