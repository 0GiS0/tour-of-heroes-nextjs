import { getHero } from "@/app/lib/data";
import Form from "@/app/ui/form";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: number }> }) {

    const params = await props.params;
    const id = params.id;


    console.log("Getting hero with id: ", id);

    const hero = await getHero(id);

    console.log("Hero: ", hero);

    if (!hero) {
        notFound();
    }

    return (
        <main>
            <Form hero={hero} />
        </main>
    );

}