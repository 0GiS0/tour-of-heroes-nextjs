import HeroesTable from '@/app/ui/heroes/HeroesTable';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-6">
                <h1 className="text-2xl">Heroes</h1>
                <Link 
                    href="/heroes/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Hero
                </Link>
            </div>

            <HeroesTable />
        </div>
    );
}