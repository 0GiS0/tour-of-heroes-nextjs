import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteVillain } from '@/app/lib/actions';


export function DeleteVillain({ id }: { id: number }) {
    const deleteVillainWithId = deleteVillain.bind(null, id);
    return (
        <form action={deleteVillainWithId}>
            <button className="rounded-md bg-red-900 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-800 cursor-pointer">
                <FontAwesomeIcon icon={faTrash} size="1x" className="w-4 h-4" />
            </button>
        </form>
    );
}