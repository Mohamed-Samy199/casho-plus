import casho from '../../assets/casho.png'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-casho-ink py-8 font-arabic">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-sm text-white/60 sm:flex-row sm:px-10">
        <div>
          <img
            src={casho}
            alt="كاشو بلس"
            className=" w-64 rounded-xl object-contain"
          />
        </div>
        <p dir="ltr">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
