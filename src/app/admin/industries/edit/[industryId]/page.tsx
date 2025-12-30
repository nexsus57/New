
import React from 'react';
import AdminIndustryEditView from '@/components/admin/views/AdminIndustryEditView';
import { INITIAL_INDUSTRIES_DETAILED } from '../../../../../constants';

// CRITICAL: Even admin pages need static params in export mode
export async function generateStaticParams() {
  return INITIAL_INDUSTRIES_DETAILED.map((industry) => ({
    industryId: industry.id,
  }));
}

export default function IndustryEditPage() {
  return <AdminIndustryEditView />;
}
