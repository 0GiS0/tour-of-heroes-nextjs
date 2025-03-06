import { getHeroes } from "../lib/data";
import Image from 'next/image';



export default async function HeroesTable() {

    const heroes = await getHeroes();

    console.log(heroes);

    return (
        // <div className="mt-6 flow-root">
        //     <div className="inline-block min-w-full align-middle">
        //         <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
        //             <div className="md:hidden">

        //                 {heroes?.map((hero) => (
        //                     <div
        //                         key={hero.id}
        //                         className="mb-2 w-full rounded-md bg-white p-4"
        //                     >
        //                         <div className="flex items-center justify-between border-b pb-4">
        //                             <div>
        //                                 <div className="mb-2 flex items-center">
        //                                     {/* <Image
        //                                         src={hero.imageurl}
        //                                         className="mr-2 rounded-full"
        //                                         width={28}
        //                                         height={28}
        //                                         alt={`${hero.name}'s profile picture`}
        //                                     /> */}
        //                                     <p>{hero.name}</p>
        //                                 </div>
        //                                 <p className="text-sm text-gray-500">{hero.description}</p>
        //                             </div>
        //                             {/* <InvoiceStatus status={invoice.status} /> */}
        //                         </div>
        //                         <div className="flex w-full items-center justify-between pt-4">
        //                             {/* <div>
        //                                 <p className="text-xl font-medium">
        //                                     {formatCurrency(invoice.amount)}
        //                                 </p>
        //                                 <p>{formatDateToLocal(invoice.date)}</p>
        //                             </div> */}
        //                             {/* <div className="flex justify-end gap-2">
        //                                 <UpdateInvoice id={invoice.id} />
        //                                 <DeleteInvoice id={invoice.id} />
        //                             </div> */}
        //                         </div>
        //                     </div>
        //                 ))}

        //             </div>
        //         </div>
        //     </div>

        // </div>
        <>
            <ul>
                {heroes?.map((hero) => (
                    <li
                        key={hero.id}
                        className="mb-2 w-full rounded-md bg-white p-4"
                    >
                        {hero.name}: {hero.description}
                    </li>                
                ))}
            </ul>
        </>
    );

}