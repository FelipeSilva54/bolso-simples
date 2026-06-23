import { useState, useEffect, useMemo } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Category, CategoryType } from '@/types/category';
import { getCategoriesRef, createCategory, updateCategory as updateCategoryService, seedDefaultCategories } from '@/services/categories';
import { useAuth } from '@/store/AuthContext';
import { useLanguage } from '@/store/LanguageContext';
import { PT_NAME_TO_TRANSLATION_KEY } from '@/constants/categories';

type RawCategory = {
  id: string;
  name: string;
  nameKey?: string;
  icon: string;
  color: string;
  type: CategoryType;
  isDefault: boolean;
};

type UseCategoriesResult = {
  categories: Category[];
  loading: boolean;
  addCategory: (data: { name: string; icon: string; color: string; type: CategoryType }) => Promise<void>;
  updateCategory: (categoryId: string, data: { name: string; icon: string; color: string; type: CategoryType }) => Promise<void>;
};

export function useCategories(): UseCategoriesResult {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rawCategories, setRawCategories] = useState<RawCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRawCategories([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(getCategoriesRef(user.uid), (snapshot) => {
      if (snapshot.empty) {
        seedDefaultCategories(user.uid).catch((e) => {
          if (__DEV__) console.warn('seedDefaultCategories falhou:', e);
        });
      }

      setRawCategories(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name as string,
            nameKey: data.nameKey as string | undefined,
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

  // Traduz nomes de categorias padrão reativamente quando o idioma muda.
  // Categorias criadas pelo usuário (isDefault=false) mantêm o nome original.
  const categories = useMemo<Category[]>(() =>
    rawCategories.map((cat) => {
      if (!cat.isDefault) return { ...cat };
      const key = cat.nameKey ?? PT_NAME_TO_TRANSLATION_KEY[cat.name];
      return {
        id: cat.id,
        name: key ? t(key) : cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
        isDefault: cat.isDefault,
      };
    }),
    [rawCategories, t],
  );

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
