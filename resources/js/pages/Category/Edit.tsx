import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Category, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, CircleAlert } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Edit a Category',
        href: '/categories/create',
    },
];

interface PageProps {
    flash: {
        message?: string
    },
    parentCategories: Category[],
    category: Category
}

export default function Edit() {
    const { props } = usePage<{ parentCategories: PageProps['parentCategories']; flash: PageProps['flash']; category: PageProps['category'] }>();
    const { category } = props;
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        parent_id: category.parent_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            put(route('categories.update', category.id));
        } catch (error) {

        }
    }

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(0)


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit a Category" />
            <div className='w-6/12 p-4'>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Display error  */}

                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Errors!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className='gap-1.5'>
                        <Label htmlFor="product name">Category</Label>
                        <div className="mt-1">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {value
                                            ? props.parentCategories.find((parentCategory) => parentCategory.id === value)?.name
                                            : "Select parent category..."}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command className="w-full">
                                        <CommandInput placeholder="Search category..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No category found.</CommandEmpty>
                                            <CommandGroup>
                                                {props.parentCategories.map((category) => (
                                                    <CommandItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                        onSelect={(currentValue) => {
                                                            const selected = props.parentCategories.find((c) => c.id.toString() === currentValue)?.id || 0;
                                                            data.parent_id = selected === 0 ? null : selected;
                                                            setValue(selected)
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        {category.name}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                value === category.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="Category Name">Name</Label>
                        <Input type='text' name='name' placeholder="Category Name" value={data.name} onChange={(e) => setData('name', e.target.value)}></Input>
                    </div>
                    <Button disabled={processing} type="submit">Add Category</Button>
                </form>
            </div>
        </AppLayout>
    );
}
