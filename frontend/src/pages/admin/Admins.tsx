import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import DataTable, { type Column } from '../../components/admin/ui/DataTable';
import StatusBadge from '../../components/admin/ui/StatusBadge';
import ActionMenu from '../../components/admin/ui/ActionMenu';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import Modal from '../../components/admin/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import type { User, AdminFormData } from '../../types';

const PERMISSION_GROUPS: Record<string, string[]> = {
  Posts: ['posts.view', 'posts.create', 'posts.edit', 'posts.delete', 'posts.publish'],
  Users: ['users.view', 'users.create', 'users.edit', 'users.delete', 'users.ban'],
  Categories: ['categories.view', 'categories.create', 'categories.edit', 'categories.delete'],
  Tags: ['tags.view', 'tags.create', 'tags.edit', 'tags.delete'],
  Comments: ['comments.view', 'comments.moderate', 'comments.delete'],
  Dashboard: ['dashboard.analytics', 'dashboard.reports', 'dashboard.settings'],
  Media: ['media.upload', 'media.delete'],
};

export default function Admins() {
  const toast = useToast();
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availablePerms, setAvailablePerms] = useState<Record<string, string>>({});

  const [modal, setModal] = useState(false);
  const [permModal, setPermModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isActing, setIsActing] = useState(false);

  const [form, setForm] = useState<AdminFormData>({ name: '', username: '', email: '', password: '', permissions: [] });
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [permTarget, setPermTarget] = useState<User | null>(null);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllAdmins({ page, limit: 10 });
      setAdmins(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch { toast.error('Failed to load admins'); }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => {
    fetchAdmins();
    adminService.getAvailablePermissions().then((perms) => setAvailablePerms(perms)).catch(() => {});
  }, [fetchAdmins]);

  const openCreate = () => {
    setEditAdmin(null);
    setForm({ name: '', username: '', email: '', password: '', permissions: [] });
    setModal(true);
  };

  const openEdit = (admin: User) => {
    setEditAdmin(admin);
    setForm({ name: admin.name, username: admin.username, email: admin.email, password: '', permissions: admin.permissions ?? [] });
    setModal(true);
  };

  const openPermissions = (admin: User) => {
    setPermTarget(admin);
    setSelectedPerms(admin.permissions ?? []);
    setPermModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActing(true);
    try {
      if (editAdmin) {
        const { password, ...data } = form;
        await adminService.updateAdmin(editAdmin._id, password ? form : data);
        toast.success('Admin updated');
      } else {
        await adminService.createAdmin(form);
        toast.success('Admin created');
      }
      setModal(false);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save admin');
    } finally { setIsActing(false); }
  };

  const handleSavePerms = async () => {
    if (!permTarget) return;
    setIsActing(true);
    try {
      await adminService.updatePermissions(permTarget._id, selectedPerms);
      toast.success('Permissions updated');
      setPermModal(false);
      fetchAdmins();
    } catch { toast.error('Failed to update permissions'); }
    finally { setIsActing(false); }
  };

  const handleToggleActive = async (admin: User) => {
    try {
      if (admin.isActive) {
        await adminService.deactivateAdmin(admin._id);
        toast.success('Admin deactivated');
      } else {
        await adminService.activateAdmin(admin._id);
        toast.success('Admin activated');
      }
      fetchAdmins();
    } catch { toast.error('Failed to update admin'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsActing(true);
    try {
      await adminService.deleteAdmin(deleteTarget._id);
      toast.success('Admin deleted');
      setDeleteTarget(null);
      fetchAdmins();
    } catch { toast.error('Failed to delete admin'); }
    finally { setIsActing(false); }
  };

  const togglePerm = (perm: string) =>
    setSelectedPerms((prev) => prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]);

  const toggleGroup = (perms: string[]) => {
    const allSelected = perms.every((p) => selectedPerms.includes(p));
    setSelectedPerms((prev) =>
      allSelected ? prev.filter((p) => !perms.includes(p)) : [...new Set([...prev, ...perms])]
    );
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Admin',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{u.name}</p>
            <p className="text-xs text-neutral-400">@{u.username}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (u) => <span className="text-sm text-neutral-600">{u.email}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'superadmin' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'}`}>
          {u.role}
        </span>
      ),
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (u) => <span className="text-sm text-neutral-600">{u.permissions?.length ?? 0} granted</span>,
    },
    { key: 'isActive', header: 'Status', render: (u) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (u) => (
        <ActionMenu
          actions={[
            { label: 'Edit', onClick: () => openEdit(u) },
            { label: 'Permissions', onClick: () => openPermissions(u) },
            { label: u.isActive ? 'Deactivate' : 'Activate', onClick: () => handleToggleActive(u) },
            { label: 'Delete', variant: 'danger', onClick: () => setDeleteTarget(u) },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Admins">
      <PageHeader
        title="Admin Management"
        description="Manage admin accounts and permissions (Superadmin only)"
        action={<Button size="sm" onClick={openCreate}>+ New Admin</Button>}
      />

      <DataTable
        columns={columns}
        data={admins}
        isLoading={isLoading}
        keyExtractor={(u) => u._id}
        emptyMessage="No admins found."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editAdmin ? 'Edit Admin' : 'New Admin'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input
            label={editAdmin ? 'New Password (leave blank to keep)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required={!editAdmin}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isActing}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Permissions Modal */}
      <Modal isOpen={permModal} onClose={() => setPermModal(false)} title={`Permissions — ${permTarget?.name}`} size="lg">
        <div className="space-y-4">
          {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
            const allSelected = perms.every((p) => selectedPerms.includes(p));
            return (
              <div key={group} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-neutral-900 text-sm">{group}</h4>
                  <button
                    type="button"
                    onClick={() => toggleGroup(perms)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {perms.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm)}
                        onChange={() => togglePerm(perm)}
                        className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-xs text-neutral-700">{availablePerms[perm] ?? perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 justify-end pt-4 mt-4 border-t border-neutral-200">
          <Button variant="secondary" size="sm" onClick={() => setPermModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSavePerms} isLoading={isActing}>Save Permissions</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Permanently delete admin "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        isLoading={isActing}
      />
    </AdminLayout>
  );
}
