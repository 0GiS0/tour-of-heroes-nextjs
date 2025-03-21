import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteVillain } from "./DeleteVillain";
import Link from "next/link";
import Image from 'next/image';

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getVillains } from "@/app/lib/data";

export async function VillainsTable() {
    const villains = await getVillains();
    console.log("Villains: ", villains);
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-lg shadow card">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-100 sm:pl-6">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-700 text-red-600 focus:ring-red-500" />
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">Bio</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-100">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 bg-slate-900">
                            {villains?.map((villain) => (
                                <tr key={villain.id} className="hover:bg-slate-800">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-100 sm:pl-6">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-700 text-red-600 focus:ring-red-500" />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-100">
                                        <div className="flex items-center">
                                            <div className="h-24 w-24 flex-shrink-0">
                                                <Image className="h-24 w-24 rounded-full border-2 border-red-800" src={villain.image_url} alt="" width={96} height={96} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-100">{villain.name}</div>
                                                <div className="text-sm text-gray-400">{villain.name.toLowerCase()}@example.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-400">{villain.bio}</td>
                                    <td className="px-3 py-4 text-sm text-gray-400">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${villain.status === 'Online' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                            {villain.status}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex justify-end gap-2">
                                            <button className="rounded-md bg-red-900 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-800">
                                                <Link
                                                    href={`/villains/${villain.id}/edit`}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Link>
                                            </button>
                                            <DeleteVillain id={villain.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}