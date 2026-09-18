import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageCircle,
  Send,
} from "lucide-react";

const REMOTE_STEPS = [
  {
    icon: FileText,
    number: "01",
    title: "اختار الخدمة",
    description: "حدد نوع المعاملة أو الخدمة اللي محتاجها.",
  },
  {
    icon: Send,
    number: "02",
    title: "ابعت طلبك",
    description: "أرسل بياناتك والمستندات المطلوبة بأمان.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "نتواصل معاك",
    description: "فريقنا يراجع الطلب ويكلمك بالتفاصيل.",
  },
];

const REMOTE_SERVICES = [
  "التحويلات المالية",
  "سداد الفواتير والرسوم",
  "شحن الرصيد والباقات",
  "مراجعة وتجهيز المستندات",
];

export default function RemoteService() {
  return (
    <section
      id="remote-service"
      className="relative overflow-hidden bg-white px-5 py-24 sm:px-10 lg:px-16"
    >
      {/* خلفيات زخرفية بسيطة */}
      <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-casho-yellow/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-casho-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* المحتوى الرئيسي */}
          <div className="text-right">
            <span className="inline-flex rounded-full border border-casho-blue/15 bg-casho-blue/5 px-4 py-2 text-sm font-bold text-casho-blue">
              كاشو بلس أونلاين
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight text-casho-ink sm:text-4xl lg:text-5xl">
              خدمتك تخلصها
                

              <span className="text-casho-blue">من مكانك</span>
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-casho-ink/70">
              مش لازم تيجي المكتب في كل مرة. ابعت طلبك أونلاين، وفريق كاشو بلس
              هيساعدك في معرفة المطلوب ومتابعة الخدمة معاك خطوة بخطوة.
            </p>
            <p className="mt-4  max-w-xl text-xl leading-relaxed text-casho-ink/60">
              يتم تأكيد تفاصيل الخدمة والرسوم معك قبل التنفيذ.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2" dir="ltr">
              {REMOTE_SERVICES.map((service) => (
                <div
                  key={service}
                  className="flex items-center justify-end gap-3 text-sm text-casho-ink/80"
                >
                  <span className="text-lg">{service}</span>

                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-casho-blue"
                  />
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap justify-end gap-4" dir="ltr">
              {/* استبدل الرقم برقم واتساب المكتب */}
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-casho-yellow px-7 py-3.5 text-sm font-bold text-casho-blue shadow-[0_8px_24px_rgba(255,210,31,0.25 )] transition-transform hover:scale-[1.04]"
              >
                <MessageCircle size={19} />
                اطلب خدمتك أونلاين
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-casho-blue/25 px-7 py-3.5 text-sm font-bold text-casho-blue transition-colors hover:border-casho-blue hover:bg-casho-blue hover:text-white"
              >
                تواصل معنا
                <ArrowLeft size={18} />
              </a>
            </div>

            
          </div>

          {/* كارت خطوات الطلب */}
          <div className="rounded-3xl border border-casho-blue/10 bg-casho-blue/[0.04] p-6 shadow-[0_14px_45px_rgba(6,32,56,0.08)] sm:p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-casho-blue">
                طريقة الطلب
              </p>

              <h3 className="mt-2 text-2xl font-black text-casho-ink">
                3 خطوات بسيطة
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-casho-ink/60">
                ابعت طلبك، وإحنا هنساعدك نعرف المطلوب ونبدأ معاك إجراءات الخدمة.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              {REMOTE_STEPS.map(
                ({ icon: Icon, number, title, description }, index) => (
                  <div
                    key={title}
                    className="relative flex items-start gap-4 text-right"
                  >
                    {index < REMOTE_STEPS.length - 1 && (
                      <div className="absolute right-[21px] top-12 h-8 w-px bg-casho-blue/15" />
                    )}

                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-casho-yellow text-casho-blue">
                      <Icon size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-casho-blue/60">
                          {number}
                        </span>

                        <h4 className="font-bold text-casho-ink">{title}</h4>
                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-casho-ink/60">
                        {description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
