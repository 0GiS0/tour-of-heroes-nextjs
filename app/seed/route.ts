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



async function seedHeroes() {

    await sql`CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    inserted_at TIMESTAMP DEFAULT NOW()
)`;

    const insertedHeroes = await Promise.all(
        heroes.map(async (hero) => {
            const { id, name, description, imageUrl } = hero;
            return await sql`INSERT INTO heroes (id, name, description, imageUrl) VALUES (${id}, ${name}, ${description}, ${imageUrl})`;
        }
        )
    );

    return insertedHeroes;
}

export async function GET() {

    try {
        const result = await sql.begin((sql) => {
            seedHeroes();
        });

        return Response.json({ message: 'Database seeded successfully' });
    }
    catch (error) {
        console.error('Error seeding database:', error);
        return Response.json({ message: 'Error seeding database' }, { status: 500 });
    }
}