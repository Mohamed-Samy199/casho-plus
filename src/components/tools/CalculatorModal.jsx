import { useEffect, useState } from "react";
import { Delete, Equal, RotateCcw } from "lucide-react";
import Modal from "../ui/Modal";

const BUTTONS = [
  ["C", "clear"], ["⌫", "backspace"], ["%", "percent"], ["÷", "/"],
  ["7", "7"], ["8", "8"], ["9", "9"], ["×", "*"],
  ["4", "4"], ["5", "5"], ["6", "6"], ["−", "-"],
  ["1", "1"], ["2", "2"], ["3", "3"], ["+", "+"],
  ["00", "00"], ["0", "0"], [".", "."], ["=", "equals"],
];

function calculate(expression) {
  const normalized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (!/^[0-9+*/().\s-]+$/.test(normalized)) return null;
  try {
    const result = Function(`"use strict"; return (${normalized})`)();
    return Number.isFinite(result) ? String(Number(result.toFixed(2))) : null;
  } catch {
    return null;
  }
}

export default function CalculatorModal({ isOpen, onClose }) {
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false);

  const clear = () => {
    setExpression("");
    setError(false);
  };

  const equals = () => {
    const result = calculate(expression);
    if (result === null) {
      setError(true);
      return;
    }
    setExpression(result);
    setError(false);
  };

  const press = (value) => {
    if (value === "clear") return clear();
    if (value === "backspace") return setExpression((current) => current.slice(0, -1));
    if (value === "percent") {
      const match = expression.match(/(\d+(?:\.\d+)?)$/);
      if (!match) return;
      const percent = String(Number(match[1]) / 100);
      return setExpression((current) => current.slice(0, -match[1].length) + percent);
    }
    if (value === "equals") return equals();
    setError(false);
    setExpression((current) => `${current}${value}`);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (/^[0-9.]$/.test(event.key)) press(event.key);
      else if (["+", "-", "*", "/"].includes(event.key)) press(event.key);
      else if (event.key === "Enter" || event.key === "=") press("equals");
      else if (event.key === "Backspace") press("backspace");
      else if (event.key === "Escape") onClose();
      else if (event.key.toLowerCase() === "c") press("clear");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <Modal title="الآلة الحاسبة" isOpen={isOpen} onClose={onClose}>
      <div dir="ltr" className="space-y-4">
        <div className="rounded-2xl border border-border bg-bg-raised px-4 py-4 text-right">
          <p className="min-h-5 break-all text-sm text-text-secondary">{expression || "0"}</p>
          <p className="mt-1 min-h-9 break-all text-3xl font-bold tracking-wide text-text-primary">
            {error ? "عملية غير صحيحة" : expression || "0"}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BUTTONS.map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={() => press(value)}
              className={`flex h-14 items-center justify-center rounded-xl border text-lg font-semibold transition-colors hover:bg-bg-raised ${
                value === "equals" ? "border-accent bg-accent text-bg" :
                ["/", "*", "-", "+", "percent"].includes(value) ? "border-accent/30 bg-accent-soft text-accent" :
                value === "clear" || value === "backspace" ? "border-danger/20 text-danger" : "border-border"
              }`}
              aria-label={label}
            >
              {value === "backspace" ? <Delete size={20} /> : value === "equals" ? <Equal size={20} /> : label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>تدعم لوحة المفاتيح: الأرقام والعمليات و Enter</span>
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 hover:text-accent"><RotateCcw size={14} /> مسح</button>
        </div>
      </div>
    </Modal>
  );
}
