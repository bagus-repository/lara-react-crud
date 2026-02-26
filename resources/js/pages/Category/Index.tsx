import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Category, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useConfirm } from '@/contexts/global-confirm-context';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

interface PageProps {
    flash: {
        message?: string
    },
    categories: Category[]
}

export default function Index() {

    const { categories, flash } = usePage().props as unknown as PageProps;

    const { processing, delete: destroy } = useForm();

    const confirmDialog = useConfirm();

    const handleDelete = async (id: number, name: string) => {
        if (!await confirmDialog({
            title: "Delete category?",
            description: `Are you sure you want to delete "${name}"?`,
            confirmText: "Delete",
            cancelText: "Cancel",
        })) {
            return;
        }
        destroy(route("categories.destroy", id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className='m-4'>
                <Link href={route('categories.create')}><Button>Create a Category</Button></Link>
            </div>
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Notification!</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {categories.length > 0 && (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent categories.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow>
                                    <TableCell className="font-medium">{category.id}</TableCell>
                                    <TableCell>{category.parent?.name}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link href={route('categories.edit', category.id)}><Button className="bg-slate-600 hover:bg-slate-700">Edit</Button></Link>
                                        <Button size={'sm'} disabled={processing} onClick={() => handleDelete(category.id, category.name)} className="bg-red-500 hover:bg-red-700">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>

                </div>

            )}
        </AppLayout>
    );
}
