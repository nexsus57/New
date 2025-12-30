
import React from 'react';
import AdminProductEditView from '@/components/admin/views/AdminProductEditView';
import { PRODUCTS } from '../../../../../constants';

// CRITICAL: Even admin pages need static params in export mode
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    productId: product.id,
  }));
}

export default function EditProductPage() {
  return <AdminProductEditView />;
}
