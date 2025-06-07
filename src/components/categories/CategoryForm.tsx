
import React, { useState, useEffect } from 'react';
import { Tag, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'user_id' | 'created_at'>) => void;
  isLoading: boolean;
}

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  
  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    }
  }, [category]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    onSubmit({
      name,
      color,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category Name
        </label>
        <div className="relative">
          <Tag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="e.g., Food, Transportation, Entertainment"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Color
        </label>
        <div className="flex items-center space-x-3">
          <Palette size={18} className="text-slate-400" />
          <div className="grid grid-cols-6 gap-2">
            {colors.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  color === colorOption ? 'border-slate-400' : 'border-transparent'
                }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full mt-6">
        {category ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
};
