import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Edit3,
  FileText,
  Pin,
  Plus,
  Search,
  Tag,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import SubmitButton from "../../components/ui/SubmitButton";
import Pagination from "../../components/ui/Pagination";
import {
  useArchiveNote,
  useCreateNote,
  useNotes,
  useToggleNotePin,
  useUpdateNote,
} from "../../hooks/notes/useNotes";

const CATEGORIES = {
  general: "عام",
  operations: "تشغيل",
  finance: "مالي",
  follow_up: "متابعة",
  reminder: "تذكير",
};
const PRIORITIES = { low: "منخفضة", medium: "متوسطة", high: "عالية" };
const EMPTY_FORM = {
  title: "",
  content: "",
  category: "general",
  priority: "medium",
  tags: "",
  dueDate: "",
  isPinned: false,
};

export default function NotesPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priority: "",
    archived: false,
    page: 1,
    size: 12,
  });
  const [editor, setEditor] = useState(null);
  const { data, isLoading, isError, error } = useNotes(filters);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const pinMutation = useToggleNotePin();
  const archiveMutation = useArchiveNote();
  const mutationError =
    createMutation.error ||
    updateMutation.error ||
    pinMutation.error ||
    archiveMutation.error;

  const openCreate = () => setEditor({ mode: "create", form: EMPTY_FORM });
  const openEdit = (note) =>
    setEditor({
      mode: "edit",
      id: note._id,
      form: {
        ...note,
        tags: (note.tags || []).join(", "),
        dueDate: note.dueDate ? note.dueDate.slice(0, 10) : "",
      },
    });
  const changeFilter = (field, value) =>
    setFilters((current) => ({ ...current, [field]: value, page: 1 }));
  const saveNote = async (event) => {
    event.preventDefault();
    const dataToSend = {
      ...editor.form,
      tags: editor.form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dueDate: editor.form.dueDate || null,
    };
    if (editor.mode === "create") await createMutation.mutateAsync(dataToSend);
    else await updateMutation.mutateAsync({ id: editor.id, data: dataToSend });
    setEditor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">الملاحظات</h1>
          <p className="mt-1 text-sm text-white/60">
            مساحة منظمة لملاحظات المكتب والمتابعات والتعليمات المهمة.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg hover:bg-accent-hover"
        >
          <Plus size={18} /> ملاحظة جديدة
        </button>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="relative md:col-span-2">
            <Search
              size={17}
              className="absolute right-3 top-3 text-text-muted"
            />
            <input
              value={filters.search}
              onChange={(e) => changeFilter("search", e.target.value)}
              placeholder="ابحث في العنوان أو المحتوى أو الوسوم"
              className="w-full rounded-lg border border-border bg-bg-raised py-2.5 pe-10 ps-8 text-text-primary"
            />
          </label>
          <select
            value={filters.category}
            onChange={(e) => changeFilter("category", e.target.value)}
            className="rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-text-primary"
          >
            <option value="">كل التصنيفات</option>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => changeFilter("priority", e.target.value)}
            className="rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-text-primary"
          >
            <option value="">كل الأولويات</option>
            {Object.entries(PRIORITIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => changeFilter("archived", false)}
            className={`rounded-full px-3 py-1.5 text-sm ${!filters.archived ? "bg-accent text-bg" : "bg-bg-raised text-text-secondary"}`}
          >
            النشطة
          </button>
          <button
            type="button"
            onClick={() => changeFilter("archived", true)}
            className={`rounded-full px-3 py-1.5 text-sm ${filters.archived ? "bg-accent text-bg" : "bg-bg-raised text-text-secondary"}`}
          >
            الأرشيف
          </button>
        </div>
      </Card>

      {isLoading && (
        <p className="py-12 text-center text-text-secondary">
          جاري تحميل الملاحظات...
        </p>
      )}
      {isError && (
        <p className="py-12 text-center text-danger">
          تعذر تحميل الملاحظات:{" "}
          {error?.response?.data?.message || error?.message}
        </p>
      )}
      {!isLoading && data && !data.result?.length && (
        <Card>
          <div className="py-12 text-center text-text-secondary">
            <FileText className="mx-auto mb-3" size={38} />
            <p>لا توجد ملاحظات في هذا القسم.</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 text-accent hover:underline"
            >
              أنشئ أول ملاحظة
            </button>
          </div>
        </Card>
      )}

      {data?.result?.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.result.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => openEdit(note)}
                onPin={() => pinMutation.mutate(note._id)}
                onArchive={() =>
                  archiveMutation.mutate({
                    id: note._id,
                    archived: !note.isArchived,
                  })
                }
              />
            ))}
          </div>
          <Pagination
            currentPage={data.currentPage}
            pages={data.pages}
            onPageChange={(page) =>
              setFilters((current) => ({ ...current, page }))
            }
          />
        </>
      )}

      <Modal
        title={editor?.mode === "edit" ? "تعديل الملاحظة" : "ملاحظة جديدة"}
        isOpen={Boolean(editor)}
        onClose={() => setEditor(null)}
      >
        {editor && (
          <form onSubmit={saveNote} className="space-y-4">
            <Input
              label="العنوان"
              required
              value={editor.form.title}
              onChange={(e) =>
                setEditor((current) => ({
                  ...current,
                  form: { ...current.form, title: e.target.value },
                }))
              }
            />
            <label className="block">
              <span className="mb-1.5 block text-sm text-text-secondary">
                المحتوى
              </span>
              <textarea
                required
                rows={7}
                maxLength={5000}
                value={editor.form.content}
                onChange={(e) =>
                  setEditor((current) => ({
                    ...current,
                    form: { ...current.form, content: e.target.value },
                  }))
                }
                className="w-full resize-y rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-text-primary"
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-text-secondary">
                  التصنيف
                </span>
                <select
                  value={editor.form.category}
                  onChange={(e) =>
                    setEditor((current) => ({
                      ...current,
                      form: { ...current.form, category: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-text-primary"
                >
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-text-secondary">
                  الأولوية
                </span>
                <select
                  value={editor.form.priority}
                  onChange={(e) =>
                    setEditor((current) => ({
                      ...current,
                      form: { ...current.form, priority: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-text-primary"
                >
                  {Object.entries(PRIORITIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="وسوم مفصولة بفاصلة"
                value={editor.form.tags}
                onChange={(e) =>
                  setEditor((current) => ({
                    ...current,
                    form: { ...current.form, tags: e.target.value },
                  }))
                }
                placeholder="عميل، متابعة، مهم"
              />
              <Input
                type="date"
                label="تاريخ متابعة اختياري"
                value={editor.form.dueDate}
                onChange={(e) =>
                  setEditor((current) => ({
                    ...current,
                    form: { ...current.form, dueDate: e.target.value },
                  }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={editor.form.isPinned}
                onChange={(e) =>
                  setEditor((current) => ({
                    ...current,
                    form: { ...current.form, isPinned: e.target.checked },
                  }))
                }
              />{" "}
              تثبيت الملاحظة في الأعلى
            </label>
            {mutationError && (
              <p className="text-sm text-danger">
                {mutationError?.response?.data?.message ||
                  mutationError.message}
              </p>
            )}
            <SubmitButton
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editor.mode === "edit" ? "حفظ التعديلات" : "حفظ الملاحظة"}
            </SubmitButton>
          </form>
        )}
      </Modal>
    </div>
  );
}

function NoteCard({ note, onEdit, onPin, onArchive }) {
  const priorityClass =
    note.priority === "high"
      ? "text-danger"
      : note.priority === "low"
        ? "text-text-secondary"
        : "text-accent";
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-2 py-1 text-xs text-accent">
              {CATEGORIES[note.category]}
            </span>
            <span className={`text-xs ${priorityClass}`}>
              أولوية {PRIORITIES[note.priority]}
            </span>
            {note.isPinned && <Pin size={14} className="text-accent" />}
          </div>
          <h2 className="truncate font-bold">{note.title}</h2>
        </div>
        <FileText size={20} className="shrink-0 text-text-muted" />
      </div>
      <p className="mt-3 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
        {note.content}
      </p>
      <div className="mt-4 flex flex-wrap gap-1">
        {(note.tags || []).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-bg-raised px-2 py-1 text-xs text-text-secondary"
          >
            <Tag size={11} />
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto border-t border-border pt-4">
        <div className="mb-3 flex items-center justify-between text-xs text-text-muted">
          <span>{note.createdBy?.name || "—"}</span>
          <span>
            {note.dueDate
              ? `متابعة: ${new Date(note.dueDate).toLocaleDateString("ar-EG")}`
              : new Date(note.updatedAt).toLocaleDateString("ar-EG")}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-bg-raised px-2 py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <Edit3 size={15} /> تعديل
          </button>
          <button
            type="button"
            onClick={onPin}
            className="rounded-lg bg-bg-raised px-3 py-2 text-text-secondary hover:text-accent"
            aria-label="تثبيت"
          >
            <Pin size={15} />
          </button>
          <button
            type="button"
            onClick={onArchive}
            className="rounded-lg bg-bg-raised px-3 py-2 text-text-secondary hover:text-accent"
            aria-label={note.isArchived ? "استرجاع" : "أرشفة"}
          >
            {note.isArchived ? (
              <ArchiveRestore size={15} />
            ) : (
              <Archive size={15} />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
