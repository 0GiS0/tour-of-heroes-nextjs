
'use client';
import { useRouter } from "next/navigation";
import { createVillain, VillainFormState } from "../../lib/actions";
import { useActionState } from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
export default function CreateVillainForm() {
    const router = useRouter();
    const handleGoBack = () => {
        router.back();
    };
    const initialState: VillainFormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createVillain, initialState);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    useEffect(() => {
        if (state?.success) {
            router.push('/villains');
        }
    }, [state, router]);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
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
        await formAction(formData);
    }
    return (
        <form action={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-gray-200 flex items-center justify-center">
                    {previewImage ? (
                        <Image
                            src={previewImage}
                            alt="Villain preview"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform hover:scale-110 duration-300"
                            onError={() => setPreviewImage(null)}
                        />
                    ) : (
                        <div className="text-gray-400 text-xs text-center p-4">
                            Image preview will appear here
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
                    placeholder="Villain name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Villain description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                ></textarea>
            </div>
            <div className="mb-6">
                <label htmlFor="villainImage" className="block text-sm font-medium text-gray-700 mb-1">Villain Image</label>
                <input
                    type="file"
                    id="villainImage"
                    name="villainImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">Upload an image for your villain (PNG, JPG, JPEG)</p>
            </div>
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Villain
                </button>
            </div>
        </form>
    );
}