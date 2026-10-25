const normalize = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

export function buildOwnerAccounts(users = [], partners = []) {
  const linkedUsers = new Map(
    users.filter((user) => user.partner).map((user) => [String(user.partner), user])
  );
  const partnerNames = new Set(partners.map((partner) => normalize(partner.name)));
  const partnerPhones = new Set(partners.flatMap((partner) => (partner.phoneNumbers || []).map(normalize)));
  const accounts = [];
  const add = (record, type) => {
    const role = type === "Partner" ? "partner" : record.role;
    const roleLabel = role === "admin" ? "أدمن" : role === "partner" ? "شريك" : "موظف";
    accounts.push({
      ...record,
      type,
      ownerType: type,
      value: `${type}:${record._id}`,
      label: `${record.name} — ${roleLabel}`,
    });
  };

  users.forEach((user) => {
    // الحساب الشريك هو نفس سجل Partner، فلا نعرض نسختين.
    if (user.partner && user.role === "partner") return;
    // توافق مع السجلات القديمة التي أُنشئ فيها حساب User بدون حفظ partner.
    // إذا تطابق الاسم أو الرقم مع سجل شريك، نعرض سجل الشريك فقط.
    if (!user.partner && (partnerNames.has(normalize(user.name)) || (user.phoneNumbers || []).some((phone) => partnerPhones.has(normalize(phone))))) return;
    add(user, "User");
  });

  const seenNames = new Set();
  const seenPhones = new Set();

  [...partners]
    .sort((left, right) => {
      const leftLinked = linkedUsers.get(String(left._id));
      const rightLinked = linkedUsers.get(String(right._id));
      const leftCurrent = leftLinked?.role === "partner" ? 1 : 0;
      const rightCurrent = rightLinked?.role === "partner" ? 1 : 0;
      if (leftCurrent !== rightCurrent) return rightCurrent - leftCurrent;
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    })
    .forEach((partner) => {
      const linkedUser = linkedUsers.get(String(partner._id));
      if (linkedUser && linkedUser.role !== "partner") return;
      const name = normalize(partner.name);
      const phones = (partner.phoneNumbers || []).map(normalize);
      if (seenNames.has(name) || phones.some((phone) => seenPhones.has(phone))) return;
      add(partner, "Partner");
      seenNames.add(name);
      phones.forEach((phone) => seenPhones.add(phone));
    });

  return accounts;
}
