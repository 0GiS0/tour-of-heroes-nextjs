import { FaTachometerAlt, FaUserShield, FaSkullCrossbones, FaDatabase } from 'react-icons/fa';

export default function SideNav() {
    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-xl font-bold">Tour of Heroes</h1>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <a href="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <FaTachometerAlt className="mr-2" /> Dashboard
                </a>
                <a href="/heroes" className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <FaUserShield className="mr-2" /> Heroes
                </a>
                <a href="/villains" className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <FaSkullCrossbones className="mr-2" /> Villains
                </a>
                <a href="/seed" className="flex items-center p-2 hover:bg-gray-700 rounded">
                    <FaDatabase className="mr-2" /> Reset Database
                </a>
            </nav>
        </div>
    );
}