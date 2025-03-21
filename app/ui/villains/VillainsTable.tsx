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
                <div className="overflow-hidden rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bio</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {villains?.map((villain) => (
                                <tr key={villain.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <div className="h-24 w-24 flex-shrink-0">
                                                <Image className="h-24 w-24 rounded-full" src={villain.image_url} alt="" width={96} height={96} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{villain.name}</div>
                                                <div className="text-sm text-gray-500">{villain.name.toLowerCase()}@example.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{villain.bio}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${villain.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {villain.status}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex justify-end gap-2">
                                            <button className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100">
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