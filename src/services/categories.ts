import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { CategoryType } from '@/types/category';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

export function getCategoriesRef(userId: string): CollectionReference<DocumentData> {
  return collection(db, 'users', userId, 'categories');
}

export async function createCategory(
  userId: string,
  input: { name: string; icon: string; color: string; type: CategoryType; isDefault?: boolean },
): Promise<string> {
  const ref = await addDoc(getCategoriesRef(userId), {
    name: input.name,
    icon: input.icon,
    color: input.color,
    type: input.type,
    isDefault: input.isDefault ?? false,
  });
  return ref.id;
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  data: Partial<{ name: string; icon: string; color: string; type: CategoryType }>,
): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'categories', categoryId), data);
}

export async function deleteCategory(userId: string, categoryId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'categories', categoryId));
}

// Cria as categorias padrão na primeira vez que o usuário acessa o app.
// Idempotente: se já existir qualquer categoria, não faz nada.
export async function seedDefaultCategories(userId: string): Promise<void> {
  const ref = getCategoriesRef(userId);
  const snapshot = await getDocs(ref);
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  for (const category of DEFAULT_CATEGORIES) {
    const newDocRef = doc(ref);
    batch.set(newDocRef, {
      name: category.name,
      nameKey: category.nameKey,
      icon: category.icon,
      color: category.color,
      type: category.type,
      isDefault: true,
    });
  }
  await batch.commit();
}
