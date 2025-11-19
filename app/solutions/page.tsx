import Navbar from '@/components/public-pages/navbar';
import Footer from '@/components/public-pages/footer';
import { ArrowRight } from 'lucide-react';
import { features } from '@/data/features';
import BodyPublicLink from '@/components/public-pages/body-public-link';
import Image from 'next/image';
import { Metadata } from 'next';
import CarouselSection from './components/carousel-section';

export const metadata: Metadata = {
  title: 'Markdown Solutions for Teams and Collaborative Projects',
  description:
    'Explore solutions to streamline team collaboration and documentation. Write, preview, and manage Markdown projects efficiently in real time.',
};

export default function Page() {
  return (
    <div className="h-auto bg-gray-200">
      <Navbar />
      <div className="grid grid-cols-1 gap-y-10 flex-col lg:px-[1%] place-items-center h-auto">
        <section className="flex w-full h-[420px]">
          <div className="relative rounded-b-3xl w-full flex items-center px-6 overflow-hidden">
            <Image
              src="/images/banner.png"
              alt="Solution Page Hero Background"
              fill={true}
              priority
            />
            <div className="grid grid-cols-1 place-items-center lg:px-[8%] justify-end h-full">
              <div className="relative pt-35 h-full max-w-3xl w-full flex flex-col pb-12 gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 drop-shadow-lg">
                  Mondrey Markdown Solutions to Accelerate Your Workflow
                </h1>
                <p className="text-sm md:text-[16px] text-slate-200 drop-shadow-md">
                  Mondrey helps teams and individuals streamline their writing workflow, stay
                  organized, and collaborate effectively. Whether you’re creating documentation,
                  notes, or project content, Mondrey makes Markdown simple, intuitive, and
                  productive, empowering you to focus on what truly matters.
                </p>
                <div className="pb-15">
                  <BodyPublicLink title="Get Started For Free" href={'/login'} Icon={ArrowRight} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 rounded-3xl bg-white flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-6">Why Teams Choose Mondrey</h2>
          <p className="text-gray-600 max-w-2xl mb-12">
            Empower your team to create, collaborate, and deliver faster with a modern Markdown
            workspace built for clarity, speed, and teamwork.
          </p>

          <div className="grid grid-cols-2 gap-8 max-w-5xl w-full px-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start gap-4 p-6 rounded-2xl bg-linear-to-r from-slate-100 to-slate-200 shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
              >
                <div className="shrink-0 p-3 bg-slate-800/90 rounded-xl">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative py-10 rounded-3xl w-full flex items-center justify-center bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white mb-8">
          <div className="relative px-6 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Bring Clarity and Speed to Your Workflow
            </h2>
            <p className="text-gray-300 text-sm md:text-[16px] leading-relaxed max-w-2xl">
              Skip the setup, skip the mess, Mondrey Markdown helps you write, preview, and
              collaborate in real time. Everything you need for modern documentation, all in one
              seamless platform.
            </p>
            <BodyPublicLink title="Get Started For Free" href={'/login'} Icon={ArrowRight} />
          </div>
        </section>

        <CarouselSection />
      </div>
      <Footer />
    </div>
  );
}
