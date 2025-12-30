'use client';

import Link from 'next/link';
import { INITIAL_INDUSTRIES_DETAILED } from '../../../constants';

export default function AdminIndustriesListView() {
    const industries = INITIAL_INDUSTRIES_DETAILED;

    return (
         <div>
            <h1 className="text-3xl font-bold text-admin-text mb-6">Industries</h1>
            
            <div className="bg-admin-card shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="border-b-2 border-admin-border bg-gray-50">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Industry Name</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-admin-text-light uppercase tracking-wider">Products</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-admin-text-light uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {industries.map((industry) => (
                                <tr key={industry.id} className="border-b border-admin-border hover:bg-gray-50">
                                    <td className="px-5 py-4 text-sm">
                                        <div className="flex items-center">
                                            {industry.image ? (
                                                <img src={industry.image} alt={industry.name} className="w-16 h-10 object-cover rounded-md mr-4 flex-shrink-0" />
                                            ) : (
                                                <div className="w-16 h-10 bg-gray-200 rounded-md mr-4 flex-shrink-0"></div>
                                            )}
                                            <p className="text-admin-text font-semibold whitespace-no-wrap">{industry.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-admin-text-light whitespace-normal max-w-md truncate">{industry.description}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-center">
                                        <span className="text-admin-text-light">{industry.products.length}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <Link href={`/admin/industries/edit/${industry.id}`} className="text-admin-accent hover:text-admin-accent-hover font-semibold">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}