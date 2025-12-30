
import { useMemo } from 'react';
import { PRODUCTS } from '../../constants';
import { ALL_CATEGORIES } from '../../data/seoData';
import { Category } from '../../types';

const AdminCategoriesPage = () => {
    const categories = useMemo(() => {
        // Create a map of all known categories from the definitive source for easy lookup of details
        const categoryDetailsMap = new Map(ALL_CATEGORIES.map(c => [c.id, c]));
        // Get unique category IDs that are actually used by products
        const uniqueCategoryIdsInUse = Array.from(new Set(PRODUCTS.map(p => p.category)));
        // Create the final list of categories that have products, enriching them with details
        return uniqueCategoryIdsInUse.map(id => {
            const details = categoryDetailsMap.get(id);
            // Fallback for categories that might be in use but not in the ALL_CATEGORIES list
            const fallback: Category = { 
                id, 
                name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
                subtitle: 'N/A', 
                icon: 'SparklesIcon',
                description: '',
                image: '' 
            };
            return details || fallback;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-admin-text mb-6">Categories</h1>

            <div className="bg-admin-card shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="border-b-2 border-admin-border bg-gray-50">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Category</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Slug</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Subtitle</th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-admin-text-light uppercase tracking-wider">Product Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-admin-border hover:bg-gray-50">
                                    <td className="px-5 py-4 text-sm font-semibold text-admin-text flex items-center">
                                        {category.image ? (
                                            <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded-md mr-4 flex-shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-md mr-4 flex-shrink-0"></div>
                                        )}
                                        <span>{category.name}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-admin-text-light">{category.id}</td>
                                    <td className="px-5 py-4 text-sm text-admin-text-light">{category.subtitle}</td>
                                    <td className="px-5 py-4 text-sm text-admin-text-light text-center">
                                        {PRODUCTS.filter(p => p.category === category.id).length}
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-4 text-sm text-admin-text-light">
                Note: This list is dynamically generated from products in use. Category details are read-only.
            </p>
        </div>
    );
};

export default AdminCategoriesPage;
