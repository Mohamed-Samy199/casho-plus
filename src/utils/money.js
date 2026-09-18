/**
 * كل المبالغ متخزنة في الباك إند بالقرش (integer) عشان نتفادى مشاكل الفواصل العشرية.
 * الملف ده هو المكان الوحيد اللي بيحصل فيه التحويل جنيه↔قرش في الفرونت،
 * عشان نضمن إن كل شاشة بتعرض وتبعت الأرقام بنفس الطريقة بالظبط.
 */

// بيحول قرش (زي ما جاي من الباك إند) لجنيه (رقم عادي، للعرض في input مثلاً)
export const piastersToEGP = (piasters) => (piasters ?? 0) / 100;

// بيحول جنيه (اللي المستخدم كاتبه) لقرش (زي ما الباك إند محتاجه)
export const egpToPiasters = (egp) => Math.round(Number(egp || 0) * 100);

// بيعرض المبلغ جاهز للعرض في الواجهة، بالجنيه المصري وفاصلة الآلاف
export const formatEGP = (piasters) => {
  const egp = piastersToEGP(piasters);
  return `${egp.toLocaleString("ar-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} جنيه`;
};