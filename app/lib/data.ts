import postgres from 'postgres';
import { Hero } from './definitios';

const sql = postgres(process.env.POSTGRES_URL!);

async function getHeroes() {
    const heroes = await sql`SELECT * FROM heroes`;
    // Transformamos los resultados para asegurar compatibilidad con el tipo Hero
    return heroes.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    })) as Hero[];
}

async function getHero(id: number) {
    const hero = await sql`SELECT * FROM heroes WHERE id = ${id}`;
    if (!hero[0]) return null;
    
    // Transformamos el resultado para asegurar compatibilidad con el tipo Hero
    return {
        id: hero[0].id,
        name: hero[0].name,
        description: hero[0].description,
        imageUrl: hero[0].imageUrl,
        createdAt: hero[0].createdAt,
        updatedAt: hero[0].updatedAt
    } as Hero;
}

export { getHeroes, getHero };