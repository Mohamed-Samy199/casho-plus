// import { X } from "lucide-react";

// export default function Modal({ title, isOpen, onClose, children }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <div className="relative w-full max-w-lg rounded-2xl border border-border bg-bg-surface p-6 shadow-xl">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-bold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-raised"
//             aria-label="إغلاق"
//           >
//             <X size={18} />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }


import { X } from "lucide-react";

export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-2xl border border-border bg-bg-surface p-6 shadow-xl">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-raised"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pe-1">{children}</div>
      </div>
    </div>
  );
}