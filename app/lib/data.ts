import postgres from 'postgres';
import { Hero } from './definitios';

const sql = postgres(process.env.POSTGRES_URL!);

/// <summary>
/// Fetches all heroes from the database.
/// </summary>
/// <returns>Array of heroes</returns>
async function getHeroes() {
    const heroes = await sql`SELECT * FROM heroes`;

    if (!heroes) return null;
    return heroes.map((hero: any) => ({
        id: hero.id,
        name: hero.name,
        description: hero.description,
        image_url: hero.image_url,
        createdAt: hero.inserted_at,
        updatedAt: hero.updated_at
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
        image_url: hero[0].image_url,
        createdAt: hero[0].inserted_at,
        updatedAt: hero[0].updated_at
    } as Hero;
}

export async function getVillains() {
    try {
        const villains = await sql`SELECT * FROM villains`;
        return villains;
    } catch (error) {
        console.error("Error fetching villains: ", error);
        return [];
    }
}

export async function getVillain(id: number) {
    try {
        const [villain] = await sql`SELECT * FROM villains WHERE id = ${id}`;
        return villain || null;
    } catch (error) {
        console.error("Error fetching villain: ", error);
        return null;
    }
}

export { getHeroes, getHero };