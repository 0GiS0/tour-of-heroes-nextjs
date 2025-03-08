'use client';

import { Hero } from "../lib/definitios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateHero, HeroFormState } from "../lib/actions";
import { useActionState } from "react";

export default function EditHeroForm({ hero }: { hero: Hero }) {
    console.log("Editing hero: ", hero);
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const initialState: HeroFormState = { message: null, errors: {} };
    const updateHeroWithId = updateHero.bind(null, hero.id);
    const [state, formAction] = useActionState(updateHeroWithId, initialState);

    return (
        <form action={formAction} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">

            <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                    {hero.imageUrl && (
                        <Image
                            src={hero.imageUrl}
                            alt={`${hero.name} image`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform hover:scale-110 duration-300"
                        />
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={hero.description}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>
            <div className="mb-6">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={hero.imageUrl}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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