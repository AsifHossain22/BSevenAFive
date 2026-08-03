'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layers, Plus } from 'lucide-react';

interface ICategory {
  id: string;
  name: string;
  slug: string;
  servicesCount: number;
}

export default function AdminCategoriesPage() {
  const [catName, setCatName] = useState('');
  const [categories, setCategories] = useState<ICategory[]>([
    {
      id: 'cat-1',
      name: 'AC Cleaning & Repair',
      slug: 'ac-repair',
      servicesCount: 12,
    },
    {
      id: 'cat-2',
      name: 'Electrical Wiring',
      slug: 'electrical',
      servicesCount: 18,
    },
    {
      id: 'cat-3',
      name: 'Plumbing Services',
      slug: 'plumbing',
      servicesCount: 8,
    },
  ]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    // TODO: Send backend API POST request
    const newCat: ICategory = {
      id: `cat-${Date.now()}`,
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      servicesCount: 0,
    };

    setCategories(prev => [...prev, newCat]);
    setCatName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Category Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and update service categories available on FixItNow.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleCreateCategory} className="flex gap-3">
            <Input
              placeholder="New category name (e.g., Home Painting)"
              value={catName}
              onChange={e => setCatName(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <Plus className="w-4 h-4 mr-1" /> Create Category
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {categories.map(cat => (
          <Card key={cat.id}>
            <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Slug: /{cat.slug}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {cat.servicesCount} services
                </span>
                <Button variant="outline" size="sm">
                  Edit Category
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
