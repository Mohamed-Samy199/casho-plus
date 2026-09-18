// import { ShieldCheck, Clock, MapPin } from "lucide-react";

// const POINTS = [
//   {
//     icon: ShieldCheck,
//     title: "أمانة في التعامل",
//     description: "كل عملية بتتسجل بالتفصيل، وفلوسك في إيد أمينة من أول لحظة.",
//   },
//   {
//     icon: Clock,
//     title: "سرعة في التنفيذ",
//     description: "معاملاتك بتخلص في دقايق، من غير تعقيد ولا انتظار طويل.",
//   },
//   {
//     icon: MapPin,
//     title: "قريب منك",
//     description: "مكتبنا في طليا — أول شارع الطابونة.",
//   },
// ];

// export default function About() {
//   return (
//     <section id="about" className="bg-slate-50 py-20 font-arabic sm:py-28">
//       <div className="mx-auto max-w-7xl px-5 sm:px-10">
//         <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
//           <div>
//             <p className="mb-3 inline-block rounded-full bg-casho-blue/10 px-4 py-1.5 text-sm font-semibold text-casho-blue">
//               من نحن
//             </p>
//             <h2 className="mb-5 text-3xl font-black leading-tight text-casho-ink sm:text-4xl">
//               خدماتك المالية
//               <br />
//               في إيد أمينة
//             </h2>
//             <p className="text-lg leading-relaxed text-slate-600">
//               كاشو بلس مكتب خدمات متكامل بيقدّم حلول مالية وإلكترونية لعملائه من الأفراد والشركات.
//               بنشتغل بشفافية كاملة، وكل معاملة عندنا ليها سجل واضح تقدر ترجعله في أي وقت.
//             </p>
//           </div>

//           <div className="space-y-4">
//             {POINTS.map(({ icon: Icon, title, description }) => (
//               <div
//                 key={title}
//                 className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
//               >
//                 <div className="h-fit rounded-xl bg-casho-yellow/15 p-3">
//                   <Icon className="text-casho-blue" size={22} />
//                 </div>
//                 <div>
//                   <h3 className="mb-1 font-bold text-casho-ink">{title}</h3>
//                   <p className="leading-relaxed text-slate-600">{description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




const STATS = [
  { value: "+500", label: "ألف عميل يثقوا فينا" },
  { value: "27", label: "محافظة بنغطيها" },
  { value: "4.9", label: "تقييم العملاء" },
];

const SERVICES = [
  {
    number: "01",
    title: "التحويلات المالية",
    description:
      "حوّل واستقبل فلوسك بسهولة وأمان، وساعد أهلك وأصحابك في أي مكان داخل مصر.",
    items: ["تحويل واستقبال الأموال", "شحن المحافظ الإلكترونية", "سداد الفواتير والالتزامات"],
  },
  {
    number: "02",
    title: "الخدمات الحكومية",
    description:
      "نساعدك تخلص خدماتك الحكومية بشكل أسرع ومن غير زحمة أو انتظار طويل.",
    items: ["سداد المصروفات والرسوم الحكومية", "استخراج وطباعة المستندات", "خدمات الدفع الإلكتروني الحكومية"],
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-casho-blue-dark px-5 py-24 sm:px-10 lg:px-16"
    >
      {/* Decorative shapes */}
      <div
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "#FFD21F" }}
      />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-casho-blue opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-casho-yellow/30 bg-casho-yellow/10 px-4 py-2 text-sm font-bold text-casho-yellow">
            خدمات أقرب ليك
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            كل معاملاتك المالية
              

            <span className="text-casho-yellow">في مكان واحد</span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
            كاشو بلس مكتب خدمات مالية إلكترونية بيساعدك تنجز تحويلاتك
            وخدماتك الحكومية بسرعة وأمان، من غير طوابير أو إجراءات معقدة.
          </p>
        </div>

        {/* Main service cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.number}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-casho-yellow/40 hover:bg-white/10 sm:p-8"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-casho-yellow/10 blur-2xl transition group-hover:bg-casho-yellow/20" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-casho-yellow text-xl font-black text-casho-blue-dark">
                    {service.number}
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/50">
                    كاشو بلس
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black text-white">
                  {service.title}
                </h3>

                <p className="mt-3 text-base leading-relaxed text-white/70">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-white/80"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-casho-yellow text-xs font-black text-casho-blue-dark">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* About message */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="text-right">
            <p className="text-sm font-bold text-casho-yellow">
              ليه تختار كاشو بلس؟
            </p>

            <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
              بنسهّل عليك المشاوير
                

              ونوفّر وقتك
            </h3>

            <p className="mt-5 text-base leading-relaxed text-white/70">
              هدفنا إننا نوفرلك تجربة بسيطة وواضحة في كل معاملة. من تحويل
              فلوسك، لسداد رسوم أو خدمة حكومية، فريق كاشو بلس موجود يساعدك
              ويضمن إن طلبك يتم بأمان واهتمام.
            </p>

            <a
              href="#contact"
              className="mt-7 inline-flex rounded-full bg-casho-yellow px-7 py-3.5 text-sm font-bold text-casho-blue-dark shadow-[0_8px_24px_rgba(255,210,31,0.25)] transition-transform hover:scale-[1.04]"
            >
              اسألنا عن خدمتك
            </a>
          </div>

          {/* Quick process */}
          <div className="rounded-3xl border border-white/10 bg-casho-ink/30 p-6 sm:p-8">
            <h4 className="text-right text-lg font-bold text-white">
              بننجز خدمتك في 3 خطوات
            </h4>

            <div className="mt-7 grid gap-6 sm:grid-cols-3">
              <div className="text-right">
                <span className="text-3xl font-black text-casho-yellow">01</span>
                <h5 className="mt-3 font-bold text-white">حدد طلبك</h5>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  قولنا محتاج تحويل أو خدمة حكومية إيه.
                </p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-casho-yellow">02</span>
                <h5 className="mt-3 font-bold text-white">راجع التفاصيل</h5>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  بنراجع البيانات معاك قبل تنفيذ العملية.
                </p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-casho-yellow">03</span>
                <h5 className="mt-3 font-bold text-white">استلم خدمتك</h5>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  معاملتك تخلص بسرعة وبشكل آمن وواضح.
                </p>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}
