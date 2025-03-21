'use client';
import { Villain } from "../../lib/definitios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateVillain, HeroFormState } from "../../lib/actions";
import { useActionState } from "react";
import { useState } from "react";

export default function EditVillainForm({ villain }: { villain: Villain }) {
    console.log("Editing villain: ", villain);
    const router = useRouter();
    const handleGoBack = () => {
        router.back();
    };
    
    const initialState: HeroFormState = { message: null, errors: {} };
    const updateVillainWithId = updateVillain.bind(null, villain.id);
    const [state, formAction] = useActionState(updateVillainWithId, initialState);
    
    const [previewImage, setPreviewImage] = useState<string | null>(villain.image_url);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [useExistingImage, setUseExistingImage] = useState(true);
    
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
    
    async function handleSubmit(formData: FormData) {
        if (selectedFile) {
            formData.append("villainImage", selectedFile);
        }
        formData.append("useExistingImage", useExistingImage.toString());
        await formAction(formData);
    }
    
    return (
        <form action={handleSubmit} className="max-w-md mx-auto p-6 card rounded-lg">
            <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-red-800 shadow-lg bg-slate-800 flex items-center justify-center">
                    {previewImage ? (
                        <Image
                            src={previewImage}
                            alt={`${villain.name} image`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform hover:scale-110 duration-300"
                            onError={() => setPreviewImage(null)}
                        />
                    ) : (
                        <div className="text-gray-500 text-xs text-center p-4">
                            No image available
                        </div>
                    )}
                </div>
            </div>
            
            {state?.message && (
                <div className="mt-4 p-3 bg-green-900 text-green-300 rounded-md">
                    {state.message}
                </div>
            )}
            
            {Object.entries(state?.errors || {}).length > 0 && (
                <div className="mt-4 p-3 bg-red-900 text-red-300 rounded-md">
                    <ul className="list-disc pl-4">
                        {Object.entries(state.errors).map(([key, errorArray]) => (
                            errorArray && errorArray.map((error: string, i: number) => (
                                <li key={`${key}-${i}`}>{error}</li>
                            ))
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={villain.name}
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-200 mb-1">Bio</label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={villain.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
                ></textarea>
            </div>
            
            <div className="mb-6">
                <label htmlFor="villainImage" className="block text-sm font-medium text-gray-200 mb-1">Villain Image</label>
                <input
                    type="file"
                    id="villainImage"
                    name="villainImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
                />
                <p className="text-xs text-gray-400 mt-1">Upload a new image or keep the existing one</p>
            </div>
            
            <input
                type="hidden"
                id="imageUrl"
                name="imageUrl"
                value={villain.image_url}
            />
            
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-red-900 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 flex items-center justify-center"
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