import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Category, CategoryType } from '@/types/category';
import { getCategoriesRef, createCategory, updateCategory as updateCategoryService } from '@/services/categories';
import { useAuth } from '@/store/AuthContext';

type UseCategoriesResult = {
  categories: Category[];
  loading: boolean;
  addCategory: (data: { name: string; icon: string; color: string; type: CategoryType }) => Promise<void>;
  updateCategory: (categoryId: string, data: { name: string; icon: string; color: string; type: CategoryType }) => Promise<void>;
};

export function useCategories(): UseCategoriesResult {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(getCategoriesRef(user.uid), (snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name as string,
            icon: data.icon as string,
            color: data.color as string,
            type: (data.type as CategoryType) ?? 'expense',
            isDefault: (data.isDefault as boolean) ?? false,
          };
        }),
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  async function addCategory(data: { name: string; icon: string; color: string; type: CategoryType }): Promise<void> {
    if (!user) throw new Error('Usuário não autenticado');
    await createCategory(user.uid, data);
  }

  async function updateCategory(categoryId: string, data: { name: string; icon: string; color: string; type: CategoryType }): Promise<void> {
    if (!user) throw new Error('Usuário não autenticado');
    await updateCategoryService(user.uid, categoryId, data);
  }

  return { categories, loading, addCategory, updateCategory };
}
