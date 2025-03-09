'use server';

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import postgres from "postgres";

export interface HeroFormState {
    message: string | null;
    errors: {
        [key: string]: string[] | undefined;
    };
}

const sql = postgres(process.env.POSTGRES_URL!);

export async function createHero(prevState: HeroFormState, formData: FormData): Promise<HeroFormState> {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    
    // Validación simple
    const errors: { [key: string]: string[] } = {};
    
    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }
    
    if (!description || description.trim() === '') {
        errors.description = ['Description is required'];
    }
    
    if (!imageUrl || imageUrl.trim() === '') {
        errors.imageUrl = ['Image URL is required'];
    }
    
    if (Object.keys(errors).length > 0) {
        return {
            message: null,
            errors
        };
    }
    
    console.log("Creating hero: ", name);
    
    try {
        await sql`
          INSERT INTO heroes (name, description, imageurl)
          VALUES (${name}, ${description}, ${imageUrl})
        `;
        
        console.log("Hero created successfully");
        revalidatePath(`/heroes`);
        redirect(`/heroes`);
    } catch (error) {
        console.error("Error creating hero: ", error);
        return {
            message: null,
            errors: {
                general: ['Failed to create hero. Please try again.']
            }
        };
    }
    
    // Este código nunca se ejecutará debido al redirect, pero TypeScript espera un retorno
    return {
        message: 'Hero created successfully',
        errors: {}
    };
}

/// <summary>
/// Updates a hero in the database.
/// </summary>
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

export async function deleteHero(id: number) {    

    console.log("Deleting hero with id: ", id);

    try {
        await sql`
          DELETE FROM heroes
          WHERE id = ${id}
      `;

        console.log("Hero deleted successfully");

    } catch (error) {

        console.error("Error deleting hero: ", error);

    }

    revalidatePath(`/heroes`);
    redirect(`/heroes`);
}
