import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Category } from '../../types';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  isLoading: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  
  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    }
  }, [category]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      color,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        placeholder="e.g., Food, Transportation"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        leftIcon={<Tag size={18} />}
      />
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 p-1 rounded-md border border-slate-300"
        />
      </div>
      
      <Button type="submit" isLoading={isLoading} className="w-full mt-6">
        {category ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
};
