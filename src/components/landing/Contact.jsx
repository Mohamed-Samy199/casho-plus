export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-white px-5 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 rounded-[2.5rem] bg-casho-blue px-6 py-14 sm:px-14 lg:grid-cols-2 lg:items-center">
        <div className="text-right">
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
            تعالى المكتب أو كلّمنا
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">
            عندك استفسار عن خدمة حكومية أو محتاج تحويلات مالية أو أي خدمة محتاجها؟ فريقنا متاح
            يرد عليك بسرعة.
          </p>

          <ul className="mt-8 space-y-4 text-white/90" dir="ltr">
            <li className="flex items-center justify-end gap-3">
              <span>19XXX</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-sm font-bold">
                ت
              </span>
            </li>
            <li className="flex items-center justify-end gap-3">
              <span>support@cashoplus.eg</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-sm font-bold">
                ب
              </span>
            </li>
            <li className="flex items-center justify-end gap-3">
              <span>متاحين طول أيام الأسبوع من ٩ صباحًا لـ ١١ مساءً</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-sm font-bold">
                س
              </span>
            </li>
          </ul>
        </div>

        <form className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
          <div className="grid gap-5">
            <label className="block text-right">
              <span className="mb-1.5 block text-sm font-semibold text-casho-ink/80">
                الاسم
              </span>
              <input
                type="text"
                placeholder="اسمك بالكامل"
                className="w-full rounded-xl border border-casho-ink/15 px-4 py-3 text-right text-casho-ink outline-none transition-colors focus:border-casho-blue"
              />
            </label>

            <label className="block text-right">
              <span className="mb-1.5 block text-sm font-semibold text-casho-ink/80">
                رقم الموبايل
              </span>
              <input
                type="tel"
                placeholder="01xxxxxxxxx"
                className="w-full rounded-xl border border-casho-ink/15 px-4 py-3 text-right text-casho-ink outline-none transition-colors focus:border-casho-blue"
              />
            </label>

            <label className="block text-right">
              <span className="mb-1.5 block text-sm font-semibold text-casho-ink/80">
                رسالتك
              </span>
              <textarea
                rows={3}
                placeholder="اكتب استفسارك هنا"
                className="w-full resize-none rounded-xl border border-casho-ink/15 px-4 py-3 text-right text-casho-ink outline-none transition-colors focus:border-casho-blue"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-casho-yellow py-3.5 text-base font-bold text-casho-blue-dark transition-transform hover:scale-[1.02]"
            >
              إرسال الرسالة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
