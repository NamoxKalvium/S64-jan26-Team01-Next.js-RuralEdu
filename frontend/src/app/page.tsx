import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#153b52]">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-8 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <svg width={30} height={30} viewBox="0 0 32 32" aria-hidden className="mr-2">
            <path d="M16 6L3 12l13 6 11.86-5.48a1 1 0 0 0 0-1.8L16 6z" fill="#18659e" />
            <ellipse cx="16" cy="24" rx="10" ry="4.5" fill="#eee" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">RuralEdu</span>
        </div>
        <div className="flex gap-2 items-center">
          <button aria-label="Search" className="p-2 rounded-full text-[#18659e] hover:bg-blue-50">
            <svg width={22} height={22} fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#18659e" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="#18659e" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button aria-label="Profile" className="p-2 rounded-full text-[#18659e] hover:bg-blue-50">
            <svg width={26} height={26} fill="none" viewBox="0 0 30 30">
              <circle cx="15" cy="11" r="5" fill="#eee" stroke="#18659e" />
              <ellipse cx="15" cy="22" rx="8" ry="5" fill="#eee" stroke="#18659e" />
            </svg>
          </button>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="max-w-[1200px] mx-auto py-12 px-4 xl:py-24 xl:px-0 flex flex-col xl:flex-row items-center xl:items-start justify-between min-h-[70vh] gap-12">
          {/* LEFT - TEXT + IMAGE */}
          <div className="flex-1 flex flex-col items-center xl:items-start">
            <div className="w-full max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">RuralEdu boosts learning outcomes!</h1>
              <p className="text-lg sm:text-xl text-neutral-700 mb-8">
                Learn with millions by exploring lessons, tackling practice problems and getting support from trusted educators.
              </p>
            </div>
            {/* Hero image with shapes */}
            <div className="relative mt-2">
              {/* Yellow star accent */}
              <svg className="absolute -left-12 top-16 w-10 h-10" viewBox="0 0 32 32">
                <path stroke="#ffd900" strokeWidth="3" strokeLinecap="round" d="M16 3v26M3 16h26M7.5 7.5l17 17M7.5 24.5l17-17" />
              </svg>
              {/* Orange square accent */}
              <svg className="absolute top-2 right-0 w-7 h-7" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" stroke="#fb7185" strokeWidth="2.5" rx="3" />
              </svg>
              {/* The Pentagonal student image */}
              <div className="relative z-10">
                <Image
                  src="/faces.png"
                  width={320}
                  height={320}
                  alt="Student"
                  className="shadow-xl border-2 border-white"
                  style={{
                    clipPath: "polygon(49% 3%, 95% 28%, 77% 93%, 20% 93%, 2% 28%)"
                  }}
                  priority
                />
              </div>
              {/* Green squiggle accent */}
              <svg className="absolute left-40 -bottom-6 w-44 h-12 rotate-3" viewBox="0 0 200 50">
                <path d="M5 40 Q 30 10, 55 40 T 105 40 Q 130 10, 155 40 T 195 40" stroke="#80c995" strokeWidth="4" fill="none" />
              </svg>
            </div>
          </div>

          {/* RIGHT - SIGNUP */}
          <aside className="flex-1 flex flex-col items-center xl:items-start pt-4 xl:pt-20">
            <div className="w-full max-w-md xl:mx-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center xl:text-left">Start learning today by signing up!</h2>
              <div className="flex flex-col gap-4 mb-2">
                <a href="/login" className="w-full bg-[#eaf3fa] text-[#18659e] text-lg font-semibold rounded-md py-3 px-4 shadow border hover:bg-[#18659e] hover:text-white transition text-center">
                  I'm a learner
                </a>
                <a href="/login" className="w-full bg-[#eaf3fa] text-[#18659e] text-lg font-semibold rounded-md py-3 px-4 shadow border hover:bg-[#18659e] hover:text-white transition text-center">
                  I'm a teacher
                </a>
              </div>
              <a className="text-[#18659e] underline text-sm font-medium hover:text-[#153b52] block mt-3 text-center xl:text-left" href="/login">
                Already have a RuralEdu account? Log in
              </a>
            </div>
          </aside>
        </section>

        {/* WHY RURALEDU WORKS */}
        <section className="bg-[#f9fafb] border-t border-neutral-200">
          <div className="max-w-5xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10">Why RuralEdu works</h2>
            <div className="grid gap-10 md:grid-cols-3 text-left">
              {/* Personalized learning */}
              <div className="flex flex-col items-center md:items-start">
                <Image
                  src="/personalized.png"
                  alt="Personalized learning"
                  width={96}
                  height={96}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Personalized learning</h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Learners practice at their own pace, filling gaps first and then moving ahead
                  when they are ready, even when the connection is patchy.
                </p>
              </div>

              {/* Trusted content */}
              <div className="flex flex-col items-center md:items-start">
                <Image
                  src="/trusted.png"
                  alt="Trusted content"
                  width={96}
                  height={96}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Trusted content</h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Built with teachers, RuralEdu lessons stay aligned to curriculum and are
                  optimized to load fast on low-bandwidth connections.
                </p>
              </div>

              {/* Tools for teachers */}
              <div className="flex flex-col items-center md:items-start">
                <Image
                  src="/empower.png"
                  alt="Tools to empower teachers"
                  width={96}
                  height={96}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Tools to empower teachers</h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Simple dashboards help teachers spot where students are stuck and assign
                  right-sized offline-first practice, without any heavy UI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEACHERS SECTION */}
        <section className="bg-white border-t border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
            {/* Faces collage */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/faces.png"
                alt="Teachers and students using RuralEdu"
                width={420}
                height={420}
                className="max-w-full h-auto"
                priority={false}
              />
            </div>

            {/* Testimonial */}
            <div className="flex-1 max-w-xl">
              <p className="uppercase tracking-[0.15em] text-xs font-semibold text-neutral-500 mb-3">
                Teachers
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-snug mb-6">
                “I’m finally able to truly differentiate my classroom. RuralEdu has been
                priceless for my students’ engagement.”
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Local Maths Teacher / Govt. School / Rural India
              </p>
              <p className="text-sm text-neutral-700 mb-6">
                We help teachers support their entire classroom with lightweight tools that
                work offline-first. Even on shared devices and low-end phones, lessons open
                quickly and progress is saved safely on the device.
              </p>
              <a
                href="/signup/teacher"
                className="inline-block px-6 py-2 rounded-md bg-[#18659e] text-white text-sm font-semibold hover:bg-[#153b52] transition"
              >
                Teachers, start here
              </a>
            </div>
          </div>
        </section>

        {/* LEARNERS HERO + QUOTE (You can learn anything) */}
        <section className="bg-white border-t border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
            {/* Left text */}
            <div className="flex-1">
              <p className="uppercase tracking-[0.15em] text-xs font-semibold text-neutral-500 mb-3">
                Learners and students
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-snug mb-4">
                <span className="bg-[#ccead9] px-1 mr-1">You</span>
                can learn anything.
              </h2>
              <p className="text-sm text-neutral-700 mb-6 max-w-md">
                Build a deep, solid understanding in maths, science and more with lessons
                that keep working even when the internet drops.
              </p>
              <a
                href="/signup/learner"
                className="inline-block px-6 py-2 rounded-md bg-[#18659e] text-white text-sm font-semibold hover:bg-[#153b52] transition"
              >
                Learners, start here
              </a>
            </div>

            {/* Right illustration */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/laptop.png"
                alt="Learner with laptop"
                width={420}
                height={260}
                className="max-w-full h-auto"
                priority={false}
              />
            </div>
          </div>

          {/* Quote strip */}
          <div className="bg-[#f9fafb] border-t border-neutral-200 mt-8">
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <p className="text-xl sm:text-2xl leading-relaxed text-neutral-800 mb-8">
                “When I was a child, I used to fear mathematics. But now, I am in love with
                learning because RuralEdu lets me practice slowly, even when our network is weak.”
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/girlchild.png"
                    alt="Learner testimonial"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-neutral-600">
                  <p className="font-semibold tracking-wide">Anjali</p>
                  <p>Class 7 Student / Govt. School / Rural Haryana</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
