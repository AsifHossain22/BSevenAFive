/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, Trash2, Loader2, Layers } from 'lucide-react';
import {
  ICategory,
  getAllCategories,
  createCategory,
  deleteCategory,
} from '@/service/categoryService';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // FormState
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // LoadCategories
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        toast.error('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  // CreateCategoryHandler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    const toastId = toast.loading('Creating category...');
    setIsSubmitting(true);

    try {
      const response = await createCategory({ name, description });

      if (response?.success || response?.data) {
        const newCategory = response.data || response;
        setCategories(prev => [newCategory, ...prev]);
        toast.success(`Category "${name}" created successfully!`, {
          id: toastId,
        });

        setName('');
        setDescription('');
        setIsDialogOpen(false);
      } else {
        throw new Error('Failed to create category');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not create category.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // DeleteCategoryToastConfirmationActionButtons
  const handleConfirmDelete = (id: string, categoryName: string) => {
    toast(`Are you sure you want to delete category: "${categoryName}"?`, {
      action: {
        label: 'Delete',
        onClick: () => executeDeleteCategory(id, categoryName),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.dismiss(),
      },
    });
  };

  const executeDeleteCategory = async (id: string, categoryName: string) => {
    setDeletingId(id);
    const toastId = toast.loading(`Deleting "${categoryName}"...`);

    try {
      const response = await deleteCategory(id);

      if (response?.success || response) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success(`Category "${categoryName}" deleted successfully!`, {
          id: toastId,
        });
      } else {
        throw new Error(response?.message || 'Failed to delete category');
      }
    } catch (err: any) {
      toast.error(err.message || `Could not delete "${categoryName}".`, {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // SearchFilter
  const filteredCategories = categories.filter(
    c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Add, update and manage home service categories for FixItNow.
          </p>
        </div>

        {/* AddCategoryModal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1">
                  Category Name *
                </label>
                <Input
                  placeholder="Enter category name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium mb-1">Description</label>
                <Textarea
                  placeholder="Service description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Category'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SearchInput */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* CategoriesGrid */}
      {loading ? (
        <Card className="p-8 flex items-center justify-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading categories...
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No categories found. Click &ldquo;Add Category&rdquo; to create your
          first one.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map(category => {
            const isDeleting = deletingId === category.id;

            return (
              <Card key={category.id} className="flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base">{category.name}</h3>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 cursor-pointer"
                      disabled={isDeleting}
                      onClick={() =>
                        handleConfirmDelete(category.id, category.name)
                      }
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description || 'No description provided.'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
