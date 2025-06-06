import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { CategoryForm } from '../components/categories/CategoryForm';
import { useCategoryStore } from '../store/categoryStore';
import { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, isLoading } = useCategoryStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  const handleAddCategory = async (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await addCategory(category);
    setShowAddModal(false);
  };
  
  const handleEditCategory = async (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, category);
      setShowEditModal(false);
      setSelectedCategory(null);
    }
  };
  
  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };
  
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => setShowAddModal(true)}
        >
          Add Category
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 rounded-full hover:bg-slate-100"
                  >
                    <Edit2 size={16} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="p-1.5 rounded-full hover:bg-red-100"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {categories.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-slate-500 mb-4">No categories found. Create your first category to get started.</p>
            <Button onClick={() => setShowAddModal(true)}>
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Category"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          isLoading={isLoading}
        />
      </Modal>
      
      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Category"
      >
        {selectedCategory && (
          <CategoryForm
            category={selectedCategory}
            onSubmit={handleEditCategory}
            isLoading={isLoading}
          />
        )}
      </Modal>
      
      {/* Delete Category Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Category"
        size="sm"
      >
        <div className="text-center">
          <p className="mb-4">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
