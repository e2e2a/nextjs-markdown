'use client';
import TypingText from '@/components/ui/shadcn-io/typing-text';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/public-pages/navbar';
import Footer from '@/components/public-pages/footer';
import { features } from '@/data/features';

export default function Home() {
  return (
    <div className="h-auto text-gray-900 bg-white">
      <Navbar />

      <div className="grid grid-cols-1 place-items-center gap-y-10 flex-col px-7 h-auto">
        <section className="flex w-full max-w-6xl">
          <div className="relative rounded-b-3xl w-full flex items-center justify-center px-6 bg-linear-to-r from-slate-300 to-slate-500 overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="/images/markdown.png"
                alt="Hero Background"
                layout="fill"
                objectFit="cover"
                className="opacity-10"
              />
            </div>
            <div className="grid grid-cols-1 place-items-center w-full justify-end h-full ">
              <div className="relative pt-35 h-full w-full flex flex-col items-center justify-end text-center pb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 drop-shadow-lg">
                  Build Together with Markdown<span className="text-blue-600/95"></span>
                </h1>
                <div className="text-center">
                  <TypingText
                    text={['Write Faster', 'Preview Instantly', 'Share Effortlessly']}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    className="text-3xl md:text-4xl font-extrabold"
                    textColors={['#2563EB']}
                    variableSpeed={{ min: 50, max: 120 }}
                  />
                </div>
                <Link
                  href="/login"
                  className="cursor-pointer inline-flex mt-8 px-5 py-2 border-white bg-linear-to-r from-slate-700 to-slate-800 text-white font-semibold  shadow-lg rounded-3xl transform transition-all duration-300 ease-in-out
             hover:from-blue-600 hover:to-indigo-600 hover:scale-105 hover:shadow-xl"
                >
                  Get Started For Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative flex justify-center max-w-6xl h-full">
                <Image
                  src="/images/markdown.png"
                  alt="Quote Background"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-lg drop-shadow-[#2563EB] rounded-b-none border border-b-0 border-[#2563EB]"
                  width={800}
                  height={800}
                  quality={100}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-10 max-w-6xl w-full rounded-3xl flex items-center justify-center bg-linear-to-r from-slate-800 via-slate-900 to-black text-white">
          <div className="relative max-w-4xl px-2 text-center">
            <p className="text-4xl md:text-2xl font-bold italic mb-4 drop-shadow-lg">
              Struggling with messy note-taking or complicated markdown editors? Mondrey Markdown
              lets you write, preview, and save instantly, all in one simple platform. No setup, no
              distractions, just your ideas coming to life.
            </p>
            <span className="text-gray-300 text-xl">— Mondrey</span>
          </div>
        </section>

        <section className="py-10 flex flex-col max-w-6xl items-center bg-white">
          <h2 className="text-4xl font-bold mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 text-center"
                >
                  <Icon className={`mx-auto mb-4 ${feature.color ?? ''}`} size={60} />
                  <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative py-10 rounded-3xl max-w-6xl w-full flex items-center justify-center bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white mb-8">
          <div className="relative px-6 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Bring Clarity and Speed to Your Workflow
            </h2>
            <p className="text-gray-300 text-sm md:text-[16px] leading-relaxed max-w-2xl">
              Skip the setup, skip the mess, Mondrey Markdown helps you write, preview, and
              collaborate in real time. Everything you need for modern documentation, all in one
              seamless platform.
            </p>

            <Link
              href="/login"
              className="cursor-pointer inline-flex items-center mt-8 px-5 py-2 border-white bg-linear-to-r from-slate-700 to-slate-800 text-white font-semibold  shadow-lg rounded-3xl transform transition-all duration-300 ease-in-out
             hover:from-blue-600 hover:to-indigo-600 hover:scale-105 hover:shadow-xl"
            >
              Get Started For Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
