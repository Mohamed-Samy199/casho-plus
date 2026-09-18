import {
  Landmark,
  ArrowLeftRight,
  Wallet,
  Receipt,
  Printer,
  Megaphone,
} from "lucide-react";

const SERVICES = [
  {
    icon: Landmark,
    title: "الخدمات الحكومية",
    description:
      "إنجاز وسداد الخدمات والرسوم الحكومية بسهولة، مع مساعدة في تجهيز وطباعة المستندات المطلوبة.",
  },
  {
    icon: ArrowLeftRight,
    title: "تحويلات إلكترونية",
    description:
      "تحويل الأموال بين المحافظ الإلكترونية والحسابات البنكية داخل مصر بسرعة وأمان.",
  },
  {
    icon: Wallet,
    title: "المحافظ الإلكترونية",
    description:
      "شحن وسحب وإيداع وإدارة رصيد محفظتك الإلكترونية من خلال مختلف الوسائل المتاحة.",
  },
  {
    icon: Receipt,
    title: "دفع الفواتير",
    description:
      "سداد فواتير الكهرباء والمياه والغاز والإنترنت، بالإضافة إلى مختلف الخدمات اليومية.",
  },
  {
    icon: Printer,
    title: "خدمات الطباعة",
    description:
      "طباعة وتصوير المستندات، وتجهيز الملفات والأوراق المطلوبة بجودة عالية وأسعار مناسبة.",
  },
  {
    icon: Megaphone,
    title: "الدعاية والإعلان",
    description:
      "تصميم وتنفيذ محتوى إعلاني يساعدك على عرض مشروعك والوصول إلى عملائك بشكل أفضل.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white px-5 py-24 font-arabic sm:px-10 lg:px-16"
    >
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-casho-yellow/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-casho-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="max-w-2xl text-right">
          <span className="inline-flex rounded-full border border-casho-blue/15 bg-casho-blue/5 px-4 py-2 text-sm font-bold text-casho-blue">
            خدمات كاشو بلس
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-casho-ink sm:text-4xl">
            كل اللي محتاجه <span className="text-casho-blue">في مكان واحد</span>
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-casho-ink/70">
            من التحويلات المالية والخدمات الحكومية إلى الطباعة والدعاية، بنوفرلك
            خدمات يومية تساعدك تخلص معاملاتك بسهولة وتوفر وقتك ومجهودك.
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-casho-blue/10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group bg-white p-7 text-right transition-colors duration-300 hover:bg-casho-blue sm:p-8"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-casho-blue p-3.5 transition-transform duration-300 group-hover:scale-105 group-hover:bg-white/90">
                <Icon
                  size={25}
                  strokeWidth={2.2}
                  className="text-casho-yellow"
                />
              </div>

              <h3 className="text-xl font-bold text-casho-ink transition-colors duration-300 group-hover:text-white">
                {title}
              </h3>

              <p className="mt-3 leading-relaxed text-casho-ink/65 transition-colors duration-300 group-hover:text-white/80">
                {description}
              </p>

              <div className="mt-6 h-1 w-10 rounded-full bg-casho-blue transition-all duration-300 group-hover:w-16 group-hover:bg-white" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
