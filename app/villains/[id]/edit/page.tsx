import { getVillain } from "@/app/lib/data";
import EditHeroForm from "@/app/ui/heroes/EditHeroForm";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: number }> }) {
    const params = await props.params;
    const id = params.id;
    console.log("Getting villain with id: ", id);
    const villain = await getVillain(id);
    console.log("Villain: ", villain);
    if (!villain) {
        notFound();
    }
    return (
        <main>
            <EditHeroForm hero={villain} />
        </main>
    );
}