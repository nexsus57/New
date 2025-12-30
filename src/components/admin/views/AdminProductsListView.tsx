
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useProducts } from '../../../context/ProductContext';
import { useCategories } from '../../../context/CategoryContext';
import { PlusCircleIcon } from '../../icons/AdminIcons';

const AdminProductsListView = () => {
  const { products, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const categoryMap = useMemo(() => {
    return new Map(categories.map(c => [c.id, c.name]));
  }, [categories]);

  const getCategoryName = (categoryId: string) => {
    return categoryMap.get(categoryId) || 'Uncategorized';
  };

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
      if (selectedIds.size === filteredProducts.length) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredProducts.map(p => p.id)));
      }
  };

  const toggleSelectOne = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const handleBulkDelete = () => {
      if (window.confirm(`Are you sure you want to delete ${selectedIds.size} products? This cannot be undone.`)) {
          selectedIds.forEach(id => deleteProduct(id));
          setSelectedIds(new Set());
      }
  };

  const handleDeleteOne = (id: string, name: string) => {
      if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
          deleteProduct(id);
      }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-admin-text">Products</h1>
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Search by name, category, ID..." 
                className="p-2 border rounded-md text-sm w-64 focus:ring-2 focus:ring-admin-accent focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <Link 
              href="/admin/products/new" 
              className="bg-admin-accent text-white font-bold py-2 px-4 rounded-md hover:bg-admin-accent-hover transition-colors duration-300 flex items-center"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Product
            </Link>
        </div>
      </div>

      {selectedIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-4 flex justify-between items-center animate-fade-in">
              <span className="text-sm font-semibold text-blue-800">{selectedIds.size} items selected</span>
              <div className="space-x-2">
                  <button 
                    onClick={handleBulkDelete}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 font-semibold transition-colors"
                  >
                      Delete Selected
                  </button>
              </div>
          </div>
      )}

      <div className="bg-admin-card shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="border-b-2 border-admin-border bg-gray-50">
                <th className="px-5 py-3 text-left w-10">
                    <input 
                        type="checkbox" 
                        checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 cursor-pointer"
                    />
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Image</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Product Name / ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-admin-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`border-b border-admin-border hover:bg-gray-50 transition-colors ${selectedIds.has(product.id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-5 py-4">
                    <input 
                        type="checkbox" 
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelectOne(product.id)}
                        className="rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 object-contain rounded-md bg-white border border-gray-200 p-1"
                        onError={(e) => (e.currentTarget.src = 'https://file.garden/aIULwzQ_QkPKQcGw/tapeindialogo.png')} 
                    />
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="text-admin-text font-semibold whitespace-no-wrap">{product.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{product.id}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span className="px-2 py-1 text-xs font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full">
                        {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link 
                        href={`/admin/products/edit/${product.id}`} 
                        className="text-admin-accent hover:text-admin-accent-hover font-semibold transition-colors"
                        title="Edit Product"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => handleDeleteOne(product.id, product.name)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Delete Product"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                            <i className="fas fa-box-open text-4xl mb-3 text-gray-300"></i>
                            <p>No products found matching your search.</p>
                            <Link href="/admin/products/new" className="mt-2 text-admin-accent hover:underline font-semibold">Create New Product</Link>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsListView;
