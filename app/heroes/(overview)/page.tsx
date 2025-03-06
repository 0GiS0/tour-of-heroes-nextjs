import Table from '@/app/ui/Table';




export default function Page() {

    return (

        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Heroes</h1>
            </div>

            <Table />

        </div>

    );

}