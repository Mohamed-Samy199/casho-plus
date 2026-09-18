import { useState } from "react";
import { Paperclip } from "lucide-react";
import Modal from "../ui/Modal";
import SubmitButton from "../ui/SubmitButton";
import { useUploadReceipts } from "../../hooks/debts/useUploadReceipts";

export default function UploadReceiptModal({ debt, isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const { mutate: upload, isPending, error } = useUploadReceipts(debt?._id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.length) return;
    upload(files, {
      onSuccess: () => {
        setFiles([]);
        onClose();
      },
    });
  };

  return (
    <Modal title="رفع إيصال/مستند" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-accent">
          <Paperclip size={24} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            {files.length ? `${files.length} ملف مختار` : "اضغط لاختيار صور أو PDF"}
          </span>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </label>

        {debt?.receiptUrls?.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-text-secondary">الملفات المرفوعة قبل كده:</p>
            <div className="flex flex-wrap gap-2">
              {debt.receiptUrls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-bg-raised px-3 py-1.5 text-xs text-accent hover:underline"
                >
                  عرض الملف
                </a>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء الرفع."}
          </p>
        )}

        <SubmitButton isLoading={isPending} disabled={!files.length}>
          رفع
        </SubmitButton>
      </form>
    </Modal>
  );
}