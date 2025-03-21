'use client';

import { Hero } from "../../lib/definitios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateHero, HeroFormState } from "../../lib/actions";
import { useActionState } from "react";
import { useState } from "react";

export default function EditHeroForm({ hero }: { hero: Hero }) {
    console.log("Editing hero: ", hero);
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const initialState: HeroFormState = { message: null, errors: {} };
    const updateHeroWithId = updateHero.bind(null, hero.id);
    const [state, formAction] = useActionState(updateHeroWithId, initialState);

    // Para la previsualización de la imagen
    const [previewImage, setPreviewImage] = useState<string | null>(hero.image_url);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [useExistingImage, setUseExistingImage] = useState(true);

    // Función para manejar la vista previa cuando se selecciona una imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUseExistingImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Función personalizada para manejar la presentación del formulario
    async function handleSubmit(formData: FormData) {
        // Si hay un archivo seleccionado, lo agregamos al FormData
        if (selectedFile) {
            formData.append("heroImage", selectedFile);
        }
        
        // Indicamos si se está usando la imagen existente
        formData.append("useExistingImage", useExistingImage.toString());
        
        // Enviamos el formulario
        await formAction(formData);
    }

    return (
        <form action={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">

            <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-gray-200 flex items-center justify-center">
                    {previewImage ? (
                        <Image
                            src={previewImage}
                            alt={`${hero.name} image`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform hover:scale-110 duration-300"
                            onError={() => setPreviewImage(null)}
                        />
                    ) : (
                        <div className="text-gray-400 text-xs text-center p-4">
                            No image available
                        </div>
                    )}
                </div>
            </div>

            {state?.message && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                    {state.message}
                </div>
            )}

            {Object.entries(state?.errors || {}).length > 0 && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                    <ul className="list-disc pl-4">
                        {Object.entries(state.errors).map(([key, errors]) => (
                            errors?.map((error, i) => (
                                <li key={`${key}-${i}`}>{error}</li>
                            ))
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={hero.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={hero.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>
            <div className="mb-6">
                <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
                <input
                    type="file"
                    id="heroImage"
                    name="heroImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload a new image or keep the existing one</p>
            </div>
            
            {/* Campo oculto para enviar la URL de la imagen existente */}
            <input
                type="hidden"
                id="imageUrl"
                name="imageUrl"
                value={hero.imageUrl}
            />

            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save
                </button>
            </div>
        </form>
    );
}
