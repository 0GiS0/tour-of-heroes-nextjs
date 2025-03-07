'use client';

import { Hero } from "../lib/definitios";
import Image from "next/image";

export default function EditHeroForm({ hero }: { hero: Hero }) {
    console.log("Editing hero: ", hero);

    return (
        <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Hero image centered at the top */}
            <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                    {hero.imageurl && (
                        <Image 
                            src={hero.imageurl}
                            alt={`${hero.name} image`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform hover:scale-110 duration-300"
                        />
                    )}
                </div>
            </div>
            
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
                    defaultValue={hero.imageurl}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Save
            </button>
        </form>
    );
}