'use server';

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import postgres from "postgres";
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export interface HeroFormState {
    message: string | null;
    errors: {
        [key: string]: string[] | undefined;
    };
    success?: boolean;
}

const sql = postgres(process.env.POSTGRES_URL!);

// Función para reiniciar la secuencia de IDs
async function resetIdSequence() {
    try {
        // Esta consulta reinicia la secuencia para que comience desde el siguiente ID disponible
        await sql`SELECT setval('heroes_id_seq', (SELECT MAX(id) FROM heroes), true)`;
        console.log("ID sequence reset successfully");
    } catch (error) {
        console.error("Error resetting ID sequence:", error);
    }
}

export async function createHero(prevState: HeroFormState, formData: FormData): Promise<HeroFormState> {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    let imageUrl = "";
    
    // Validación simple
    const errors: { [key: string]: string[] } = {};
    
    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }
    
    if (!description || description.trim() === '') {
        errors.description = ['Description is required'];
    }
    
    // Procesar la imagen subida
    const heroImage = formData.get("heroImage") as File;
    
    if (!heroImage || heroImage.size === 0) {
        errors.heroImage = ['Hero image is required'];
    } else {
        try {
            // Asegurarse de que es una imagen
            if (!heroImage.type.startsWith('image/')) {
                errors.heroImage = ['File must be an image'];
            } else {
                // Generar un nombre único para la imagen basado en el nombre del héroe y timestamp
                const timestamp = Date.now();
                const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}${path.extname(heroImage.name)}`;
                const publicDirPath = path.join(process.cwd(), 'public');
                const heroesDirPath = path.join(publicDirPath, 'heroes');
                const filePath = path.join(heroesDirPath, fileName);
                
                // Asegurarnos de que el directorio existe
                if (!fs.existsSync(heroesDirPath)) {
                    fs.mkdirSync(heroesDirPath, { recursive: true });
                }
                
                // Convertir la imagen a un buffer y guardarla en el sistema de archivos
                const buffer = Buffer.from(await heroImage.arrayBuffer());
                await writeFile(filePath, buffer);
                
                // La URL de la imagen será relativa para Next.js
                imageUrl = `/heroes/${fileName}`;
            }
        } catch (error) {
            console.error("Error processing image:", error);
            errors.heroImage = ['Failed to process the image. Please try again.'];
        }
    }
    
    if (Object.keys(errors).length > 0) {
        return {
            message: null,
            errors
        };
    }
    
    console.log("Creating hero: ", name);
    
    try {
        // Reiniciamos la secuencia antes de insertar
        await resetIdSequence();
        
        // Insertar el nuevo héroe
        await sql`
          INSERT INTO heroes (name, description, imageurl)
          VALUES (${name}, ${description}, ${imageUrl})
        `;
        
        console.log("Hero created successfully");       
       
    } catch (error) {
        console.error("Error creating hero: ", error);       
    }
    
    revalidatePath(`/heroes`);
    redirect('/heroes');
}

/// <summary>
/// Updates a hero in the database.
/// </summary>
export async function updateHero(id: number, prevState: HeroFormState, formData: FormData): Promise<HeroFormState> {
    'use server';
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    let imageUrl = formData.get("imageUrl") as string;
    const useExistingImage = formData.get("useExistingImage") === 'true';
    
    // Validación simple
    const errors: { [key: string]: string[] } = {};
    
    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }
    
    if (!description || description.trim() === '') {
        errors.description = ['Description is required'];
    }
    
    // Procesar la imagen subida solo si no se está usando la existente
    if (!useExistingImage) {
        const heroImage = formData.get("heroImage") as File;
        
        if (heroImage && heroImage.size > 0) {
            try {
                // Asegurarse de que es una imagen
                if (!heroImage.type.startsWith('image/')) {
                    errors.heroImage = ['File must be an image'];
                } else {
                    // Generar un nombre único para la imagen basado en el nombre del héroe y timestamp
                    const timestamp = Date.now();
                    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}${path.extname(heroImage.name)}`;
                    const publicDirPath = path.join(process.cwd(), 'public');
                    const heroesDirPath = path.join(publicDirPath, 'heroes');
                    const filePath = path.join(heroesDirPath, fileName);
                    
                    // Asegurarnos de que el directorio existe
                    if (!fs.existsSync(heroesDirPath)) {
                        fs.mkdirSync(heroesDirPath, { recursive: true });
                    }
                    
                    // Convertir la imagen a un buffer y guardarla en el sistema de archivos
                    const buffer = Buffer.from(await heroImage.arrayBuffer());
                    await writeFile(filePath, buffer);
                    
                    // La URL de la imagen será relativa para Next.js
                    imageUrl = `/heroes/${fileName}`;
                }
            } catch (error) {
                console.error("Error processing image:", error);
                errors.heroImage = ['Failed to process the image. Please try again.'];
            }
        }
    }
    
    if (Object.keys(errors).length > 0) {
        return {
            message: null,
            errors
        };
    }

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
    redirect('/heroes');
}

export async function deleteHero(id: number) {    
    console.log("Deleting hero with id: ", id);
    try {
        await sql`
          DELETE FROM heroes
          WHERE id = ${id}
      `;
        console.log("Hero deleted successfully");
        revalidatePath(`/heroes`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting hero: ", error);
        return { success: false };
    }
}
