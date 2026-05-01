import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import DataTable, { type Column } from '../../components/admin/ui/DataTable';
import StatusBadge from '../../components/admin/ui/StatusBadge';
import ActionMenu, { type Action } from '../../components/admin/ui/ActionMenu';
import SearchBar from '../../components/admin/ui/SearchBar';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import Modal from '../../components/admin/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
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

export default function Users() {
  const toast = useToast();
  const { isSuperAdmin } = useAuth();

  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [availablePerms, setAvailablePerms] = useState<Record<string, string>>({});

  // Permissions modal
  const [permModal, setPermModal] = useState(false);
  const [permTarget, setPermTarget] = useState<User | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', username: '', email: '' });

  // Create modal
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<AdminFormData>({ name: '', username: '', email: '', password: '', permissions: [] });

  // Confirm dialogs
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);

  const [isActing, setIsActing] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllAdmins({ page, limit: 10 });
      // Filter by search client-side (backend doesn't support search on admin list)
      const data = res.data ?? [];
      const filtered = search
        ? data.filter((u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.username.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setAdmins(filtered);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch { toast.error('Failed to load admins'); }
    finally { setIsLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  useEffect(() => {
    if (isSuperAdmin) {
      adminService.getAvailablePermissions().then(setAvailablePerms).catch(() => {});
    }
  }, [isSuperAdmin]);

  // ── Permissions ──────────────────────────────────────────────────────────
  const openPermissions = (admin: User) => {
    setPermTarget(admin);
    setSelectedPerms(admin.permissions ?? []);
    setPermModal(true);
  };

  const togglePerm = (perm: string) =>
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );

  const toggleGroup = (perms: string[]) => {
    const allSelected = perms.every((p) => selectedPerms.includes(p));
    setSelectedPerms((prev) =>
      allSelected ? prev.filter((p) => !perms.includes(p)) : [...new Set([...prev, ...perms])]
    );
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

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = (admin: User) => {
    setEditTarget(admin);
    setEditForm({ name: admin.name, username: admin.username, email: admin.email });
    setEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setIsActing(true);
    try {
      await adminService.updateAdmin(editTarget._id, editForm);
      toast.success('Admin updated');
      setEditModal(false);
      fetchAdmins();
    } catch (err: any) { toast.error(err?.message ?? 'Failed to update admin'); }
    finally { setIsActing(false); }
  };

  // ── Create ───────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActing(true);
    try {
      await adminService.createAdmin(createForm);
      toast.success('Admin created');
      setCreateModal(false);
      setCreateForm({ name: '', username: '', email: '', password: '', permissions: [] });
      fetchAdmins();
    } catch (err: any) { toast.error(err?.message ?? 'Failed to create admin'); }
    finally { setIsActing(false); }
  };

  // ── Toggle active ────────────────────────────────────────────────────────
  const handleToggleActive = async () => {
    if (!toggleTarget) return;
    setIsActing(true);
    try {
      if (toggleTarget.isActive) {
        await adminService.deactivateAdmin(toggleTarget._id);
        toast.success('Admin banned');
      } else {
        await adminService.activateAdmin(toggleTarget._id);
        toast.success('Admin unbanned');
      }
      setToggleTarget(null);
      fetchAdmins();
    } catch { toast.error('Failed to update admin'); }
    finally { setIsActing(false); }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
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

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns: Column<User>[] = [
    {
      key: 'name', header: 'Admin',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
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
      key: 'role', header: 'Role',
      render: (u) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          u.role === 'superadmin' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'
        }`}>
          {u.role}
        </span>
      ),
    },
    {
      key: 'permissions', header: 'Permissions',
      render: (u) => {
        if (u.role === 'superadmin') {
          return <span className="text-xs text-neutral-400 italic">All permissions</span>;
        }
        return (
          <button
            onClick={() => isSuperAdmin && openPermissions(u)}
            className={`text-sm ${isSuperAdmin ? 'text-primary-600 hover:text-primary-700 hover:underline cursor-pointer' : 'text-neutral-600 cursor-default'}`}
          >
            {u.permissions?.length ?? 0} granted
          </button>
        );
      },
    },
    { key: 'isActive', header: 'Status', render: (u) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} /> },
    {
      key: 'createdAt', header: 'Created',
      render: (u) => <span className="text-neutral-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (u) => {
        if (!isSuperAdmin || u.role === 'superadmin') return null;
        const actions: Action[] = [
          { label: 'Edit', onClick: () => openEdit(u) },
          { label: 'Permissions', onClick: () => openPermissions(u) },
          { label: u.isActive ? 'Ban' : 'Unban', onClick: () => setToggleTarget(u), variant: u.isActive ? 'danger' : 'default' },
          { label: 'Delete', variant: 'danger', onClick: () => setDeleteTarget(u) },
        ];
        return <ActionMenu actions={actions} />;
      },
    },
  ];

  return (
    <AdminLayout title="Users">
      <PageHeader
        title="Users"
        description="Manage admin accounts and permissions"
        action={
          isSuperAdmin
            ? <Button size="sm" onClick={() => setCreateModal(true)}>+ New Admin</Button>
            : undefined
        }
      />

      <div className="w-64 mb-4">
        <SearchBar
          placeholder="Search admins..."
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
      </div>

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

      {/* Permissions Modal */}
      <Modal
        isOpen={permModal}
        onClose={() => setPermModal(false)}
        title={`Permissions — ${permTarget?.name}`}
        size="lg"
      >
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

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title={`Edit — ${editTarget?.name}`}>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input label="Name" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Username" value={editForm.username} onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))} required />
          <Input label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} required />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isActing}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="New Admin">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" value={createForm.name} onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Username" value={createForm.username} onChange={(e) => setCreateForm((p) => ({ ...p, username: e.target.value }))} required />
          <Input label="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input label="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} required />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isActing}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm: Toggle active */}
      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleActive}
        title={toggleTarget?.isActive ? 'Ban Admin' : 'Unban Admin'}
        message={`Are you sure you want to ${toggleTarget?.isActive ? 'ban' : 'unban'} "${toggleTarget?.name}"?${toggleTarget?.isActive ? ' They will no longer be able to log in.' : ''}`}
        confirmLabel={toggleTarget?.isActive ? 'Ban' : 'Unban'}
        isLoading={isActing}
        variant={toggleTarget?.isActive ? 'danger' : 'primary'}
      />

      {/* Confirm: Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Permanently delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isActing}
      />
    </AdminLayout>
  );
}
