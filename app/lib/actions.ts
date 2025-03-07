'use server';

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import postgres from "postgres";

// Redefinir el tipo FormState para evitar conflictos con el State de postgres
export interface HeroFormState {
    message: string | null;
    errors: {
        [key: string]: string[] | undefined;
    };
}

const sql = postgres(process.env.POSTGRES_URL!);

export async function updateHero(id: number, prevState: HeroFormState, formData: FormData): Promise<HeroFormState> {
    'use server';
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;

    console.log("Updating hero with id: ", id);

    try {
        await sql`
          UPDATE heroes
          SET name = ${name}, description = ${description}, imageurl = ${imageUrl}
          WHERE id = ${id}
      `;

        console.log("Hero updated successfully");



    } catch (error) {

        console.error("Error updating hero: ", error);

    }

    revalidatePath(`/heroes`);
    redirect(`/heroes`);
}