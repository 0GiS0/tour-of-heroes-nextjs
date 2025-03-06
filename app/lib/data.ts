import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!);

export async function getHeroes() {
    const heroes = await sql`SELECT * FROM heroes`;
    return heroes;
}