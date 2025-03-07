import postgres from 'postgres';
import { Hero } from './definitios';

const sql = postgres(process.env.POSTGRES_URL!);

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