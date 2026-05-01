type StatusType = 'published' | 'draft' | 'archived' | 'approved' | 'pending' | 'rejected' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: StatusType | string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-success-100 text-success-700' },
  draft: { label: 'Draft', className: 'bg-warning-100 text-warning-700' },
  archived: { label: 'Archived', className: 'bg-neutral-100 text-neutral-600' },
  approved: { label: 'Approved', className: 'bg-success-100 text-success-700' },
  pending: { label: 'Pending', className: 'bg-warning-100 text-warning-700' },
  rejected: { label: 'Rejected', className: 'bg-error-100 text-error-700' },
  active: { label: 'Active', className: 'bg-success-100 text-success-700' },
  inactive: { label: 'Inactive', className: 'bg-neutral-100 text-neutral-600' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-neutral-100 text-neutral-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
