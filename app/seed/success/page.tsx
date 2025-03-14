import Image from 'next/image';
import Link from 'next/link';

export default function SeedSuccessPage() {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100 relative">
            <Image 
                src="/global/reset-world.jpeg" 
                alt="Reset World Success" 
                layout="fill" 
                objectFit="cover" 
            />
            <div className="absolute flex flex-col items-center bg-black bg-opacity-50 p-8 rounded-lg">
                <h1 className="text-4xl font-bold text-white">Database Reset Successfully!</h1>
                <p className="text-lg text-white mt-4">Your database has been reset and seeded with initial data.</p>
                <Link href="/" legacyBehavior>
                    <a className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600">Return to Application</a>
                </Link>
            </div>
        </div>
    );
}