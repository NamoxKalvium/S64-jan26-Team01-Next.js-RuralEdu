import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#f5f8fb] font-sans min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-10 py-6 bg-white border-b border-zinc-200 shadow-sm fixed top-0 left-0 z-20">
        <div className="flex items-center gap-3">
          <Image src="/ruraledu-landing.png" width={44} height={44} alt="RuralEdu Logo" />
          <span className="text-2xl font-extrabold tracking-tight text-[#18659e]">RuralEdu</span>
        </div>
        <nav className="gap-8 text-zinc-500 font-semibold hidden md:flex">
          <a href="#features" className="hover:text-[#18659e]">Features</a>
          <a href="#about" className="hover:text-[#18659e]">About</a>
          <a href="#team" className="hover:text-[#18659e]">Team</a>
          <a href="#contact" className="hover:text-[#18659e]">Contact</a>
        </nav>
        <div>
          <a href="#get-started" className="px-6 py-2 border border-[#18659e] rounded-full text-[#18659e] font-semibold hover:bg-[#18659e] hover:text-white transition">Get Started</a>
        </div>
      </header>

      {/* CONTENT WRAPPER for scroll offset because of fixed header */}
      <div className="pt-28 flex-1 flex flex-col items-center w-full">
        {/* HERO SECTION */}
        <section className="w-full flex flex-col items-center bg-[#f5f8fb] pb-16">
          <div className="flex flex-col items-center text-center max-w-2xl px-4 gap-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#153b52] leading-tight mt-4">
              Learning for everyone,<br className="hidden sm:block" /> everywhere — even offline
            </h1>
            <p className="text-xl text-zinc-700 max-w-xl">
              RuralEdu provides world-class education, accessible in rural and low-connectivity areas. Download lessons, practice quizzes, and track progress — all without always needing the internet.
            </p>
            <a href="#get-started" className="mt-4 px-10 py-3 bg-[#18659e] text-white text-lg font-semibold rounded-full shadow hover:bg-[#11436b] transition">
              Start learning now
            </a>
          </div>
          <div className="mt-14 flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="w-64 h-64 bg-white rounded-xl shadow flex items-center justify-center">
              <Image src="/ruraledu-landing.png" alt="App Demo" width={220} height={220} />
            </div>
            <ul className="flex flex-col gap-7 text-left max-w-sm text-zinc-700">
              <li className="flex gap-4 items-start">
                <span className="text-[#18659e] font-bold text-xl">•</span>
                <span>Interactive lessons, quizzes, and progress tracking</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-[#18659e] font-bold text-xl">•</span>
                <span>Available with or without internet</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-[#18659e] font-bold text-xl">•</span>
                <span>Made for teachers, students, and schools in rural communities</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-[#18659e] font-bold text-xl">•</span>
                <span>Free, open-source, and expanding every day</span>
              </li>
            </ul>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="w-full max-w-5xl mt-8 pb-16 px-4">
          <h2 className="text-3xl font-bold text-center text-[#18659e] mb-10">Key Features</h2>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-stretch">
            <div className="flex-1 bg-white rounded-xl shadow p-7 flex flex-col gap-3 items-center text-center">
              <Image src="/globe.svg" width={48} height={48} alt="Offline" />
              <div className="text-lg font-semibold text-[#153b52]">Offline-first Access</div>
              <div className="text-zinc-600">All essential content and progress is available even in areas with poor connectivity. Learn and teach anytime, anywhere.</div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-7 flex flex-col gap-3 items-center text-center">
              <Image src="/file.svg" width={48} height={48} alt="Lessons" />
              <div className="text-lg font-semibold text-[#153b52]">Engaging Lessons & Quizzes</div>
              <div className="text-zinc-600">Lessons blend text, visuals, and interactivity to help every student succeed. Interactive quizzes reinforce learning.</div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-7 flex flex-col gap-3 items-center text-center">
              <Image src="/window.svg" width={48} height={48} alt="Tracking" />
              <div className="text-lg font-semibold text-[#153b52]">Simple Progress Tracking</div>
              <div className="text-zinc-600">Monitor student growth and identify opportunities for support with easy, visual progress dashboards.</div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow px-8 py-14 my-12 text-center flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#18659e] mb-4">About RuralEdu</h2>
          <p className="text-zinc-700 text-lg mb-4">Our mission is to break the boundaries of geography and infrastructure by delivering quality learning to every rural student. RuralEdu is open-source, community-driven, and free for all.</p>
          <p className="text-zinc-600 text-base">RuralEdu is built by educators and engineers committed to making world-class education accessible. Whether you're a student, a teacher, or a school—join us to make a difference where it's needed most.</p>
        </section>

        {/* TEAM SECTION */}
        <section id="team" className="w-full max-w-5xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-center text-[#18659e] mb-8">Our Team</h2>
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
              <Image src="/vercel.svg" width={68} height={68} alt="Team Member" className="rounded-full" />
              <div className="mt-4 text-xl font-semibold text-[#153b52]">Alex Sharma</div>
              <div className="text-zinc-600 text-sm">Lead Engineer</div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
              <Image src="/vercel.svg" width={68} height={68} alt="Team Member" className="rounded-full" />
              <div className="mt-4 text-xl font-semibold text-[#153b52]">Nina Patel</div>
              <div className="text-zinc-600 text-sm">Curriculum Expert</div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
              <Image src="/vercel.svg" width={68} height={68} alt="Team Member" className="rounded-full" />
              <div className="mt-4 text-xl font-semibold text-[#153b52]">Rohan Das</div>
              <div className="text-zinc-600 text-sm">Community Lead</div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
              <Image src="/vercel.svg" width={68} height={68} alt="Team Member" className="rounded-full" />
              <div className="mt-4 text-xl font-semibold text-[#153b52]">Fatima Qureshi</div>
              <div className="text-zinc-600 text-sm">Product Designer</div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow px-8 py-16 my-8 text-center flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#18659e] mb-3">Contact Us</h2>
          <p className="text-zinc-700 text-lg mb-8">Questions, suggestions, or want to partner? Email us anytime: <a className="text-[#18659e] underline" href="mailto:hello@ruraledu.org">hello@ruraledu.org</a></p>
          <a href="#get-started" className="px-9 py-3 bg-[#18659e] text-white text-lg font-semibold rounded-full shadow hover:bg-[#11436b] transition">Get Started</a>
        </section>
        {/* GET STARTED TAG for button scroll */}
        <div id="get-started" className="pt-24" />
      </div>

      {/* FOOTER */}
      <footer className="w-full py-6 flex flex-col md:flex-row justify-between items-center px-10 bg-white border-t border-zinc-200 mt-16">
        <div className="mb-4 md:mb-0 text-zinc-400 text-sm">&copy; {new Date().getFullYear()} RuralEdu. Empowering rural education.</div>
        <div className="flex gap-6 text-zinc-500">
          <a href="#features" className="hover:text-[#18659e]">Features</a>
          <a href="#about" className="hover:text-[#18659e]">About Us</a>
          <a href="#team" className="hover:text-[#18659e]">Team</a>
          <a href="#contact" className="hover:text-[#18659e]">Contact</a>
        </div>
      </footer>
    </div>
  );
}
