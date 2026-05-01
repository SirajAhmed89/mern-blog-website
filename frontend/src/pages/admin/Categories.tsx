import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import DataTable, { type Column } from '../../components/admin/ui/DataTable';
import ActionMenu from '../../components/admin/ui/ActionMenu';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import Modal from '../../components/admin/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { categoryAdminService } from '../../services/categoryAdminService';
import { useToast } from '../../hooks/useToast';
import type { Category, Tag, CategoryFormData, TagFormData } from '../../types';

type Tab = 'categories' | 'tags';

const COLOR_OPTIONS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Categories() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('categories');

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catModal, setCatModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<CategoryFormData>({ name: '', description: '', color: '#3b82f6' });
  const [catSaving, setCatSaving] = useState(false);
  const [catDeleting, setCatDeleting] = useState(false);

  // Tags state
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagLoading, setTagLoading] = useState(true);
  const [tagModal, setTagModal] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);
  const [tagForm, setTagForm] = useState<TagFormData>({ name: '' });
  const [tagSaving, setTagSaving] = useState(false);
  const [tagDeleting, setTagDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await categoryAdminService.getAllCategories();
      setCategories(res.data ?? []);
    } catch { toast.error('Failed to load categories'); }
    finally { setCatLoading(false); }
  }, []);

  const fetchTags = useCallback(async () => {
    setTagLoading(true);
    try {
      const res = await categoryAdminService.getAllTags();
      setTags(res.data ?? []);
    } catch { toast.error('Failed to load tags'); }
    finally { setTagLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); fetchTags(); }, [fetchCategories, fetchTags]);

  // Category handlers
  const openCatModal = (cat?: Category) => {
    setEditCat(cat ?? null);
    setCatForm(cat ? { name: cat.name, description: cat.description ?? '', color: cat.color ?? '#3b82f6' } : { name: '', description: '', color: '#3b82f6' });
    setCatModal(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;
    setCatSaving(true);
    try {
      if (editCat) {
        await categoryAdminService.updateCategory(editCat._id, catForm);
        toast.success('Category updated');
      } else {
        await categoryAdminService.createCategory(catForm);
        toast.success('Category created');
      }
      setCatModal(false);
      fetchCategories();
    } catch { toast.error('Failed to save category'); }
    finally { setCatSaving(false); }
  };

  const handleDeleteCat = async () => {
    if (!deleteCat) return;
    setCatDeleting(true);
    try {
      await categoryAdminService.deleteCategory(deleteCat._id);
      toast.success('Category deleted');
      setDeleteCat(null);
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
    finally { setCatDeleting(false); }
  };

  // Tag handlers
  const openTagModal = (tag?: Tag) => {
    setEditTag(tag ?? null);
    setTagForm(tag ? { name: tag.name } : { name: '' });
    setTagModal(true);
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagForm.name) return;
    setTagSaving(true);
    try {
      if (editTag) {
        await categoryAdminService.updateTag(editTag._id, tagForm);
        toast.success('Tag updated');
      } else {
        await categoryAdminService.createTag(tagForm);
        toast.success('Tag created');
      }
      setTagModal(false);
      fetchTags();
    } catch { toast.error('Failed to save tag'); }
    finally { setTagSaving(false); }
  };

  const handleDeleteTag = async () => {
    if (!deleteTag) return;
    setTagDeleting(true);
    try {
      await categoryAdminService.deleteTag(deleteTag._id);
      toast.success('Tag deleted');
      setDeleteTag(null);
      fetchTags();
    } catch { toast.error('Failed to delete tag'); }
    finally { setTagDeleting(false); }
  };

  const catColumns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />}
          <span className="font-medium text-neutral-900">{c.name}</span>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', render: (c) => <span className="text-neutral-500 text-xs font-mono">{c.slug}</span> },
    { key: 'description', header: 'Description', render: (c) => <span className="text-neutral-600 text-sm">{c.description || '—'}</span> },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (c) => (
        <ActionMenu actions={[
          { label: 'Edit', onClick: () => openCatModal(c) },
          { label: 'Delete', variant: 'danger', onClick: () => setDeleteCat(c) },
        ]} />
      ),
    },
  ];

  const tagColumns: Column<Tag>[] = [
    { key: 'name', header: 'Name', render: (t) => <span className="font-medium text-neutral-900">{t.name}</span> },
    { key: 'slug', header: 'Slug', render: (t) => <span className="text-neutral-500 text-xs font-mono">{t.slug}</span> },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (t) => (
        <ActionMenu actions={[
          { label: 'Edit', onClick: () => openTagModal(t) },
          { label: 'Delete', variant: 'danger', onClick: () => setDeleteTag(t) },
        ]} />
      ),
    },
  ];

  return (
    <AdminLayout title="Categories">
      <PageHeader
        title="Categories & Tags"
        description="Organize your content"
        action={
          <Button size="sm" onClick={() => tab === 'categories' ? openCatModal() : openTagModal()}>
            + New {tab === 'categories' ? 'Category' : 'Tag'}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-neutral-100 p-1 rounded-lg w-fit">
        {(['categories', 'tags'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'categories' ? (
        <DataTable columns={catColumns} data={categories} isLoading={catLoading} keyExtractor={(c) => c._id} emptyMessage="No categories yet." />
      ) : (
        <DataTable columns={tagColumns} data={tags} isLoading={tagLoading} keyExtractor={(t) => t._id} emptyMessage="No tags yet." />
      )}

      {/* Category Modal */}
      <Modal isOpen={catModal} onClose={() => setCatModal(false)} title={editCat ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSaveCat} className="space-y-4">
          <Input label="Name" value={catForm.name} onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} required />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              value={catForm.description}
              onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCatForm((p) => ({ ...p, color }))}
                  className={`w-7 h-7 rounded-full transition-transform ${catForm.color === color ? 'scale-125 ring-2 ring-offset-1 ring-neutral-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCatModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={catSaving}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Tag Modal */}
      <Modal isOpen={tagModal} onClose={() => setTagModal(false)} title={editTag ? 'Edit Tag' : 'New Tag'}>
        <form onSubmit={handleSaveTag} className="space-y-4">
          <Input label="Name" value={tagForm.name} onChange={(e) => setTagForm({ name: e.target.value })} required />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setTagModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={tagSaving}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteCat} onClose={() => setDeleteCat(null)} onConfirm={handleDeleteCat} title="Delete Category" message={`Delete "${deleteCat?.name}"? Posts in this category may be affected.`} confirmLabel="Delete" isLoading={catDeleting} />
      <ConfirmDialog isOpen={!!deleteTag} onClose={() => setDeleteTag(null)} onConfirm={handleDeleteTag} title="Delete Tag" message={`Delete tag "${deleteTag?.name}"?`} confirmLabel="Delete" isLoading={tagDeleting} />
    </AdminLayout>
  );
}
