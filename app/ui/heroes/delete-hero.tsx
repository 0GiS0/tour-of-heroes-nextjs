import { deleteHero } from '@/app/lib/actions';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DeleteHero({ id }: { id: number }) {

    const deleteHeroWithId = deleteHero.bind(null, id);

    return (
        <form action={deleteHeroWithId}>
            <button className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 cursor-pointer">
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </form>
    );
}