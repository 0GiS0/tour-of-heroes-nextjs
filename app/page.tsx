import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
      <div className="text-center z-10 bg-black/30 p-6 rounded-xl backdrop-blur-sm max-w-xl w-full shadow-2xl border border-blue-500/30">
        <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
          Heroes or Villains
        </h1>
        
        <p className="mt-2 text-lg text-white drop-shadow-lg mb-5 font-medium">
          Embark on an epic adventure through the legendary Tour of Heroes!
        </p>
        
        <a 
          href="/heroes" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-blue-500/50 border-2 border-blue-400/30"
        >
          Discover Them All 🦸‍♂️🦹‍♀️
        </a>
      </div>
      
      <div className="absolute inset-0 -z-10">
        <Image
          src="/global/splash-screen.jpeg"
          alt="Heroes splash screen"
          fill
          style={{ objectFit: 'cover', opacity: 0.8 }}
          priority
        />
      </div>
    </main>
  );
}
