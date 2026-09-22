import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, RotateCcw, Volume2 } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { usePartners } from "../../hooks/partners/usePartners";
import { useUsers } from "../../hooks/users/useUsers";
import { useCreateTransaction } from "../../hooks/transactions/useCreateTransaction";
import { useCommissionRules } from "../../hooks/commission-rules/useCommissionRules";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { STAGE_OPTIONS } from "../../constants/stages";
import { PARTY_TYPES } from "../../constants/partyTypes";
import { ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/auth.store";
import { egpToPiasters, piastersToEGP } from "../../utils/money";
import {
  getVoiceSettings,
  parseVoiceTransaction,
} from "../../utils/voiceCommand";

function commissionFor(rule, amount) {
  if (!rule) return "";
  if (rule.type === "flat") return String(piastersToEGP(rule.flatAmount || 0));
  if (rule.proportionalThreshold > 0 && amount >= rule.proportionalThreshold)
    return String(
      piastersToEGP(
        Math.round((amount / 100000) * (rule.proportionalRate || 0)),
      ),
    );
  return String(piastersToEGP(rule.flatAmount || 0));
}

export default function VoiceWalkInTransactionModal({ isOpen, onClose }) {
  const currentUser = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    ownerType: "",
    ownerId: "",
    phoneNumber: "",
    channel: CHANNEL_OPTIONS[0]?.value || "",
    stage: "",
    amount: "",
    commission: "",
  });
  const [transcript, setTranscript] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [listening, setListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef(null);
  const { data: partners = [] } = usePartners({ isActive: true });
  const { data: users = [] } = useUsers({
    enabled: currentUser?.role === ROLES.ADMIN,
  });
  const { data: rules = [] } = useCommissionRules(undefined, {
    enabled: currentUser?.role === ROLES.ADMIN,
  });
  const {
    mutate: createTransaction,
    isPending,
    error,
  } = useCreateTransaction();
  const accounts = [
    ...(currentUser?.role === ROLES.ADMIN
      ? users
      : [currentUser].filter(Boolean)
    ).map((user) => ({
      ...user,
      ownerType: "User",
      label: `${user.name} — أدمن`,
    })),
    ...partners.map((partner) => ({
      ...partner,
      ownerType: "Partner",
      label: `${partner.name} — شريك`,
    })),
  ];
  const selectedAccount = accounts.find(
    (account) =>
      account.ownerType === form.ownerType && account._id === form.ownerId,
  );
  const accountOptions = accounts.map((account) => ({
    value: `${account.ownerType}:${account._id}`,
    label: account.label,
  }));
  const phoneOptions = (selectedAccount?.phoneNumbers || []).map((phone) => ({
    value: phone,
    label: phone,
  }));

  useEffect(() => {
    if (!isOpen || !currentUser?._id) return;
    const fallback = {
      ownerType: "User",
      ownerId: currentUser._id,
      phoneNumber:
        currentUser.phoneNumbers?.length === 1
          ? currentUser.phoneNumbers[0]
          : "",
    };
    const settings = getVoiceSettings(currentUser._id, fallback);
    const account =
      accounts.find(
        (item) =>
          item.ownerType === settings.ownerType &&
          item._id === settings.ownerId,
      ) || accounts[0];
    if (account)
      setForm((old) => ({
        ...old,
        ownerType: account.ownerType,
        ownerId: account._id,
        phoneNumber: account.phoneNumbers?.includes(settings.phoneNumber)
          ? settings.phoneNumber
          : account.phoneNumbers?.length === 1
            ? account.phoneNumbers[0]
            : "",
      }));
  }, [isOpen, currentUser?._id, users.length, partners.length]);

  useEffect(() => () => recognitionRef.current?.abort(), []);
  const reset = () => {
    recognitionRef.current?.abort();
    setListening(false);
    setTranscript("");
    setHasResult(false);
    setErrorMessage("");
    setForm((old) => ({ ...old, stage: "", amount: "", commission: "" }));
  };
  const close = () => {
    reset();
    onClose();
  };
  const update = (field) => (event) =>
    setForm((old) => ({ ...old, [field]: event.target.value }));
  const setAccount = (value) => {
    const [ownerType, ownerId] = value.split(":");
    const account = accounts.find(
      (item) => item.ownerType === ownerType && item._id === ownerId,
    );
    setForm((old) => ({
      ...old,
      ownerType,
      ownerId,
      phoneNumber:
        account?.phoneNumbers?.length === 1 ? account.phoneNumbers[0] : "",
    }));
  };
  const setStage = (stage) => {
    const rule = rules.find(
      (item) => item.channel === form.channel && item.stage === stage,
    );
    setForm((old) => ({
      ...old,
      stage,
      commission: old.amount
        ? commissionFor(rule, egpToPiasters(old.amount))
        : "",
    }));
  };

  const startListening = () => {
    setErrorMessage("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage(
        "المتصفح لا يدعم التعرف على الصوت. استخدم Chrome أو Edge.",
      );
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ar-EG";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      setErrorMessage(
        event.error === "not-allowed"
          ? "اسمح باستخدام الميكروفون ثم حاول مرة أخرى."
          : "لم أفهم الكلام بوضوح. جرّب قول المبلغ ونوع العملية مرة أخرى.",
      );
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      const parsed = parseVoiceTransaction(text);
      setTranscript(text);
      setHasResult(true);
      const rule = rules.find(
        (item) => item.channel === form.channel && item.stage === parsed.stage,
      );
      setForm((old) => ({
        ...old,
        stage: parsed.stage || old.stage,
        amount: parsed.amount ? String(parsed.amount) : old.amount,
        commission:
          parsed.stage && parsed.amount
            ? commissionFor(rule, egpToPiasters(parsed.amount))
            : old.commission,
      }));
      if (parsed.missing.length)
        setErrorMessage(
          `لم أتعرف على: ${parsed.missing.join(" و ")}. أكمل الحقول يدويًا.`,
        );
    };
    recognitionRef.current = recognition;
    recognition.start();
  };
  const submit = (event) => {
    event.preventDefault();
    createTransaction(
      {
        ownerType: form.ownerType,
        ownerId: form.ownerId,
        phoneNumber: form.phoneNumber,
        channel: form.channel,
        stage: form.stage,
        partyType: PARTY_TYPES.WALK_IN,
        amount: egpToPiasters(form.amount),
        ...(form.commission !== "" && {
          commission: egpToPiasters(form.commission),
        }),
      },
      { onSuccess: close },
    );
  };

  return (
    <Modal
      title="تسجيل عملية بالصوت — عميل عابر"
      isOpen={isOpen}
      onClose={close}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl border border-accent/25 bg-accent-soft p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2 text-bg">
              <Volume2 size={20} />
            </div>
            <div>
              <p className="font-semibold text-accent">
                هذه العملية لعميل عابر
              </p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                لن يتم إنشاء ملف للعميل أو حفظ بيانات شخصية له. قل المبلغ ونوع
                العملية، ثم راجع البيانات قبل التسجيل.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-bg-raised p-4 text-center">
          <p className="mb-3 text-sm text-text-secondary">
            مثال: «سحب سيولة ٥٠٠ جنيه» أو «العملية الثالثة بمبلغ ٢٠٠ جنيه»
          </p>
          <button
            type="button"
            onClick={startListening}
            className={`mx-auto flex items-center gap-2 rounded-full px-6 py-3 font-semibold ${listening ? "bg-danger text-white" : "bg-accent text-bg"}`}
          >
            {listening ? <MicOff size={20} /> : <Mic size={20} />}
            {listening ? "إيقاف الاستماع" : "اضغط وتكلم"}
          </button>
          {listening && (
            <p className="mt-3 text-sm text-danger">جاري الاستماع...</p>
          )}
        </div>
        {transcript && (
          <div className="rounded-lg border border-border px-3 py-2 text-sm">
            <span className="text-text-secondary">النص المسموع: </span>«
            {transcript}»
          </div>
        )}
        {hasResult && (
          <div className="rounded-xl border border-accent/30 bg-bg-raised p-4">
            <p className="mb-3 font-semibold text-accent">
              مراجعة العملية قبل التأكيد
            </p>
            <p className="mb-3 text-xs text-text-secondary">
              عدّل الحساب أو الرقم أو العملية أو القيم بالأسفل إذا احتجت.
            </p>
            <div className="space-y-3">
              <Select
                label="صاحب الحساب المالي"
                value={`${form.ownerType}:${form.ownerId}`}
                onChange={(event) => setAccount(event.target.value)}
                options={accountOptions}
                placeholder="اختر الحساب"
                required
              />
              <Select
                label="الرقم/الشريحة"
                value={form.phoneNumber}
                onChange={update("phoneNumber")}
                options={phoneOptions}
                placeholder="اختر الرقم"
                required
              />
              <Select
                label="العملية"
                value={form.stage}
                onChange={(event) => setStage(event.target.value)}
                options={STAGE_OPTIONS}
                placeholder="اختر العملية"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="المبلغ (جنيه)"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={update("amount")}
                  required
                />
                <Input
                  label="العمولة (جنيه)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.commission}
                  onChange={update("commission")}
                />
              </div>
              <div className="rounded-lg border border-accent/20 bg-accent-soft p-3 text-sm">
                <p>
                  نوع الطرف: <strong>عميل عابر</strong>
                </p>
                <p className="mt-1">
                  سيتم تسجيل العملية ماليًا فقط بدون إنشاء ملف عميل.
                </p>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {errorMessage}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء تسجيل العملية."}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 hover:bg-bg-raised"
          >
            إلغاء
          </button>
          {hasResult && (
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 hover:bg-bg-raised"
            >
              <RotateCcw className="me-2 inline" size={16} /> تسجيل جديد
            </button>
          )}
          {hasResult && (
            <SubmitButton isLoading={isPending} className="flex-1">
              تأكيد
            </SubmitButton>
          )}
        </div>
      </form>
    </Modal>
  );
}
