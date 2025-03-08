import CreateHeroForm from "@/app/ui/create-hero-form";

export default function CreateHeroPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Hero</h1>
      <CreateHeroForm />
    </div>
  );
}