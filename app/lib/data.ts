import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!);

async function getHeroes() {
    const heroes = await sql`SELECT * FROM heroes`;
    return heroes;
}

async function getHero(id: number) {
    const hero = await sql`SELECT * FROM heroes WHERE id = ${id}`;
    return hero[0];
}

export { getHeroes, getHero };