import postgres from "postgres";

import { heroes, villains } from "../lib/placeholder-data";

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


    await sql`CREATE TABLE IF NOT EXISTS Heroes (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        alias VARCHAR(50),
        power VARCHAR(100),
        origin VARCHAR(100),
        bio TEXT,
        image_url VARCHAR(255),
        status VARCHAR(50)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS Villains (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        alias VARCHAR(50),
        power VARCHAR(100),
        origin VARCHAR(100),
        bio TEXT,
        image_url VARCHAR(255),
        status VARCHAR(50)
    )`;

   
}

async function seedData() {
 
    // Seeding heroes from placeholder data
    for (const hero of heroes) {
        const id = hero.id || sql`gen_random_uuid()`;
        const name = hero.name || 'Unknown Hero';
        const bio = hero.bio || hero.description || 'No bio available';
        const imageUrl = hero.imageUrl || '/public/global/not-found.jpeg';
        const status = hero.status || 'Offline';

        await sql`INSERT INTO Heroes (id, name, alias, power, origin, image_url, bio, status) VALUES (${id}, ${name}, null, null, null, ${imageUrl}, ${bio}, ${status}) ON CONFLICT DO NOTHING`;
    }

    // Seeding villains from placeholder data
    for (const villain of villains) {
        const id = villain.id || sql`gen_random_uuid()`;
        const name = villain.name || 'Unknown Villain';
        const bio = villain.bio || villain.description || 'No bio available';
        const imageUrl = villain.imageUrl || '/public/global/not-found.jpeg';
        const status = villain.status || 'Offline';

        await sql`INSERT INTO Villains (id, name, alias, power, origin, image_url, bio, status) VALUES (${id}, ${name}, null, null, null, ${imageUrl}, ${bio}, ${status}) ON CONFLICT DO NOTHING`;
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