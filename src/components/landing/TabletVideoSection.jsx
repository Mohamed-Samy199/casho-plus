const VIDEO_SRC = "/videos/casho-demo.mp4";

export default function TabletVideoSection() {
  return (
    <section
      id="video-demo"
      className="relative overflow-hidden bg-slate-50 px-5 py-20 sm:px-8 sm:py-28"
      dir="rtl"
    >
      <div className="pointer-events-none absolute -right-32 top-8 h-72 w-72 rounded-full bg-casho-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-casho-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl text-center">
        <span className="inline-flex rounded-full border border-casho-blue/15 bg-casho-blue/5 px-4 py-1.5 text-sm font-bold text-casho-blue">
          شاهد كاشو بلس
        </span>
        <h2 className="mt-4 text-3xl font-black text-casho-ink sm:text-4xl">
          كل خدماتك في تجربة واحدة
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-casho-ink/60 sm:text-lg">
          تعرّف على طريقة استخدام كاشو بلس واستمتع بإدارة معاملاتك بسرعة وأمان.
        </p>

        <div className="mx-auto mt-12 max-w-5xl rounded-[2.2rem] bg-casho-ink p-2 shadow-[0_28px_70px_rgba(6,32,56,0.25)] sm:rounded-[3rem] sm:p-3">
          <div className="relative rounded-[1.75rem] border-[5px] border-slate-700 bg-slate-900 p-1.5 sm:rounded-[2.4rem] sm:border-[7px] sm:p-2">
            <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-3 w-20 -translate-x-1/2 rounded-b-xl bg-slate-700 sm:h-4 sm:w-28" />
            <div className="relative aspect-video overflow-hidden rounded-[1.2rem] bg-gradient-to-br from-casho-blue-dark via-casho-blue to-casho-ink sm:rounded-[1.8rem]">
              {VIDEO_SRC ? (
                <video
                  className="h-full w-full object-cover"
                  src={VIDEO_SRC}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
                  <div className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-casho-yellow/50 bg-casho-yellow/15 text-2xl text-casho-yellow sm:h-20 sm:w-20 sm:text-3xl">
                    ▶
                  </div>
                  <p className="text-lg font-bold sm:text-2xl">ضع الفيديو هنا</p>
                  <p className="mt-2 text-sm text-white/65 sm:text-base">
                    غيّر قيمة VIDEO_SRC في مكوّن الفيديو إلى مسار الفيديو الخاص بك.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto mt-2 flex w-1/2 items-center justify-center sm:mt-3">
            <div className="h-1.5 w-20 rounded-full bg-slate-600 sm:h-2 sm:w-28" />
          </div>
        </div>
      </div>
    </section>
  );
}
