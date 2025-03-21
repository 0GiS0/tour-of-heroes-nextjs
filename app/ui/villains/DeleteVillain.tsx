import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteVillain } from '@/app/lib/actions';


export function DeleteVillain({ id }: { id: number }) {
    const deleteVillainWithId = deleteVillain.bind(null, id);
    return (
        <form action={deleteVillainWithId}>
            <button className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 cursor-pointer">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </form>
    );
}