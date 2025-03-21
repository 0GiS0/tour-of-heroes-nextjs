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
    const bio = formData.get("bio") as string;
    let imageUrl = "";
    
    // Validación simple
    const errors: { [key: string]: string[] } = {};
    
    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }
    
    if (!bio || bio.trim() === '') {
        errors.bio = ['Bio is required'];
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
          VALUES (${name}, ${bio}, ${imageUrl})
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
    const bio = formData.get("bio") as string;
    let imageUrl = formData.get("imageUrl") as string;
    const useExistingImage = formData.get("useExistingImage") === 'true';
    
    // Validación simple
    const errors: { [key: string]: string[] } = {};
    
    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }
    
    if (!bio || bio.trim() === '') {
        errors.bio = ['Bio is required'];
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
          SET name = ${name}, description = ${bio}, imageurl = ${imageUrl}
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

export async function deleteVillain(id: number) {
    console.log("Deleting villain with id: ", id);
    try {
        await sql`
            DELETE FROM villains
            WHERE id = ${id}
        `;
        console.log("Villain deleted successfully");
        revalidatePath(`/villains`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting villain: ", error);
        return { success: false };
    }
}

export async function createVillain(prevState: HeroFormState, formData: FormData): Promise<HeroFormState> {
    'use server';
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    let imageUrl = formData.get("imageUrl") as string;
    const useExistingImage = formData.get("useExistingImage") === 'true';

    const errors: { [key: string]: string[] } = {};

    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }

    if (!bio || bio.trim() === '') {
        errors.bio = ['Bio is required'];
    }

    if (!useExistingImage) {
        const villainImage = formData.get("villainImage") as File;

        if (villainImage && villainImage.size > 0) {
            try {
                const timestamp = Date.now();
                const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}${path.extname(villainImage.name)}`;
                const publicDirPath = path.join(process.cwd(), 'public');
                const villainsDirPath = path.join(publicDirPath, 'villains');
                const filePath = path.join(villainsDirPath, fileName);

                if (!fs.existsSync(villainsDirPath)) {
                    fs.mkdirSync(villainsDirPath, { recursive: true });
                }

                const buffer = Buffer.from(await villainImage.arrayBuffer());
                await writeFile(filePath, buffer);

                imageUrl = `/villains/${fileName}`;
            } catch (error) {
                console.error("Error processing image:", error);
                errors.villainImage = ['Failed to process the image. Please try again.'];
            }
        }
    }

    if (Object.keys(errors).length > 0) {
        return {
            message: null,
            errors
        };
    }

    try {
        await sql`
          INSERT INTO villains (name, description, imageurl)
          VALUES (${name}, ${bio}, ${imageUrl})
        `;

        console.log("Villain created successfully");
    } catch (error) {
        console.error("Error creating villain: ", error);
    }

    revalidatePath(`/villains`);
    redirect('/villains');
}

// Función para actualizar un villano (que faltaba)
export async function updateVillain(id: number, prevState: HeroFormState, formData: FormData): Promise<HeroFormState> {
    'use server';
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    let imageUrl = formData.get("imageUrl") as string;
    const useExistingImage = formData.get("useExistingImage") === 'true';
    
    // Validación simple
    const errors: { [key: string]: string[] } = {};
    
    if (!name || name.trim() === '') {
        errors.name = ['Name is required'];
    }
    
    if (!bio || bio.trim() === '') {
        errors.bio = ['Bio is required'];
    }
    
    // Procesar la imagen subida solo si no se está usando la existente
    if (!useExistingImage) {
        const villainImage = formData.get("villainImage") as File;
        
        if (villainImage && villainImage.size > 0) {
            try {
                // Asegurarse de que es una imagen
                if (!villainImage.type.startsWith('image/')) {
                    errors.villainImage = ['File must be an image'];
                } else {
                    // Generar un nombre único para la imagen basado en el nombre del villano y timestamp
                    const timestamp = Date.now();
                    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}${path.extname(villainImage.name)}`;
                    const publicDirPath = path.join(process.cwd(), 'public');
                    const villainsDirPath = path.join(publicDirPath, 'villains');
                    const filePath = path.join(villainsDirPath, fileName);
                    
                    // Asegurarnos de que el directorio existe
                    if (!fs.existsSync(villainsDirPath)) {
                        fs.mkdirSync(villainsDirPath, { recursive: true });
                    }
                    
                    // Convertir la imagen a un buffer y guardarla en el sistema de archivos
                    const buffer = Buffer.from(await villainImage.arrayBuffer());
                    await writeFile(filePath, buffer);
                    
                    // La URL de la imagen será relativa para Next.js
                    imageUrl = `/villains/${fileName}`;
                }
            } catch (error) {
                console.error("Error processing image:", error);
                errors.villainImage = ['Failed to process the image. Please try again.'];
            }
        }
    }
    
    if (Object.keys(errors).length > 0) {
        return {
            message: null,
            errors
        };
    }
    console.log("Updating villain with id: ", id);
    
    try {
        await sql`
          UPDATE villains
          SET name = ${name}, description = ${bio}, imageurl = ${imageUrl}
          WHERE id = ${id}
        `;
        
        console.log("Villain updated successfully");
     
    } catch (error) {
        console.error("Error updating villain: ", error);     
    }
    revalidatePath(`/villains`);
    redirect('/villains');
}
