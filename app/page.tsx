export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Tour Of Heroes App 🦸🏼‍♀️✨</h1>


      <a href="/heroes" className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Click here to get started
      </a>

      <p className="mt-4 text-lg">This is a simple Next.js application.</p>
    </main>

  );
}
