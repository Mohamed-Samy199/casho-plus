// import Navbar from "../components/landing/Navbar";
// import Services from "../components/landing/Services";
// import About from "../components/landing/About";
// import Contact from "../components/landing/Contact";
// import Footer from "../components/Hero";
// // الـ Hero اللي انت عامله بالفعل — عدّل المسار لو مختلف عندك
// import Hero from "../components";

// export default function HomePage() {
//   return (
//     <div className="bg-white">
//       <Navbar />
//       <Hero />
//       <Services />
//       <About />
//       <Contact />
//       <Footer />
//     </div>
//   );
// }

import Navbar from "../components/landing/Navbar";
import Services from "../components/landing/Services";
import About from "../components/landing/About";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import RemoteService from "../components/landing/RemoteService";
import TabletVideoSection from "../components/landing/TabletVideoSection";
// الـ Hero اللي انت عامله بالفعل — عدّل المسار لو مختلف عندك
// import Hero from "../components/Hero";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <TabletVideoSection />
      <Services />
      <About />
      <RemoteService />
      <Contact />
      <Footer />
    </div>
  );
}