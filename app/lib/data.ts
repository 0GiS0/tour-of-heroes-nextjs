import postgres from 'postgres';
import { Hero } from './definitios';

const sql = postgres(process.env.POSTGRES_URL!);

/// <summary>
/// Fetches all heroes from the database.
/// </summary>
/// <returns>Array of heroes</returns>
async function getHeroes() {
    const heroes = await sql`SELECT * FROM heroes`;



    return heroes.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageurl,
        createdAt: row.inserted_at,
        updatedAt: row.updated_at
    })) as Hero[];
}

/// <summary>
/// Fetches a hero by ID from the database.
/// </summary>
/// <param name="id">The ID of the hero</param>
/// <returns>The hero object or null if not found</returns>
async function getHero(id: number) {
    const hero = await sql`SELECT * FROM heroes WHERE id = ${id}`;
    if (!hero[0]) return null;
    
    return {
        id: hero[0].id,
        name: hero[0].name,
        description: hero[0].description,
        imageUrl: hero[0].imageurl,
        createdAt: hero[0].inserted_at,
        updatedAt: hero[0].updated_at
    } as Hero;
}

export { getHeroes, getHero };