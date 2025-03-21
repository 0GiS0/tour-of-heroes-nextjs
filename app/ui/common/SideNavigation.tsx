'use client';

import { FaTachometerAlt, FaUserShield, FaSkullCrossbones, FaDatabase } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function SideNav() {
    const pathname = usePathname();
    const isHeroesSection = pathname.includes('/heroes');
    const isVillainsSection = pathname.includes('/villains');
    
    // Clases condicionales según la sección
    const navBgClass = isVillainsSection 
        ? "bg-slate-900" 
        : isHeroesSection 
            ? "bg-blue-50" 
            : "bg-gray-800";
    
    const textClass = isVillainsSection 
        ? "text-gray-200" 
        : isHeroesSection 
            ? "text-gray-800" 
            : "text-white";
    
    const borderClass = isVillainsSection 
        ? "border-gray-900" 
        : isHeroesSection 
            ? "border-blue-200" 
            : "border-gray-700";
    
    const hoverClass = isVillainsSection 
        ? "hover:bg-slate-800" 
        : isHeroesSection 
            ? "hover:bg-blue-100" 
            : "hover:bg-gray-700";

    return (
        <div className={`flex flex-col w-64 h-screen ${navBgClass} ${textClass}`}>
            <div className={`flex items-center justify-center h-16 border-b ${borderClass}`}>
                <h1 className="text-xl font-bold">Tour of Heroes</h1>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <Link href="/dashboard" className={`flex items-center p-2 ${hoverClass} rounded`}>
                    <FaTachometerAlt className="mr-2" /> Dashboard
                </Link>
                <Link href="/heroes" className={`flex items-center p-2 ${hoverClass} rounded ${pathname.startsWith('/heroes') ? 'font-bold' : ''}`}>
                    <FaUserShield className="mr-2" /> Heroes
                </Link>
                <Link href="/villains" className={`flex items-center p-2 ${hoverClass} rounded ${pathname.startsWith('/villains') ? 'font-bold' : ''}`}>
                    <FaSkullCrossbones className="mr-2" /> Villains
                </Link>
                <Link href="/seed" className={`flex items-center p-2 ${hoverClass} rounded`}>
                    <FaDatabase className="mr-2" /> Reset Database
                </Link>
            </nav>
        </div>
    );
}