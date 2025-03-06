export default function SideNav() {
    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-xl font-bold">Tour of Heroes</h1>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <a href="#" className="p-2 hover:bg-gray-700 rounded">Dashboard</a>
                <a href="#" className="p-2 hover:bg-gray-700 rounded">Heroes</a>
                <a href="#" className="p-2 hover:bg-gray-700 rounded">Villains</a>                
            </nav>
        </div>
    );
}