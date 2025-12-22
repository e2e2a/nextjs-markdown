import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Facebook, ArrowRight, Briefcase } from 'lucide-react';
import Navbar from '@/components/public-pages/navbar';
import { aboutBoxes } from '@/data/about';
import Footer from '@/components/public-pages/footer';
import BodyPublicLink from '@/components/public-pages/body-public-link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About MondreyMD Collaborative Markdown Platform',
  description:
    'Learn about MondreyMD a real-time Markdown editor with team collaboration. Discover our mission to simplify writing and productivity for everyone.',
};

export default function AboutPage() {
  return (
    <main className="bg-gray-200">
      <Navbar />
      <div className="grid grid-cols-1 gap-y-10 lg:px-[1%] flex-col place-items-center h-auto">
        <section className="flex w-full h-[420px]">
          <div className="relative rounded-b-3xl w-full flex items-center px-6 overflow-hidden">
            <Image src="/images/banner.png" alt="About Page Hero Background" fill={true} priority />
            <div className="grid grid-cols-1 place-items-center lg:px-[8%] justify-end h-full">
              <div className="relative pt-35 h-full max-w-3xl w-full flex flex-col pb-12 gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 drop-shadow-lg">
                  About MondreyMD
                </h1>
                <p className="text-sm md:text-[16px] text-slate-200 drop-shadow-md">
                  Learn how MondreyMD, the powerful real-time Markdown editor with built-in team
                  collaboration, helps you create, edit, and publish together, effortlessly.
                </p>
                <div className="">
                  <BodyPublicLink title="Get started" href={'/login'} Icon={ArrowRight} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 rounded-3xl bg-slate-50 text-center">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-12">
            <h2 className="text-4xl font-bold text-slate-800">What Drives MondreyMD</h2>
            <p className="text-gray-600 max-w-3xl">
              Learn more about who we are, what we stand for, and the journey that brought MondreyMD
              to life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {aboutBoxes.map((box, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-2"
                >
                  <box.icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{box.title}</h3>
                  <p className="text-gray-600">{box.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="relative py-10 w-full max-w-5xl rounded-3xl flex items-center justify-center bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white mb-8">
          <div className="mx-auto w-full px-6 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-6">
              <Image
                src="/images/profile.jpg"
                alt="Founder"
                width={500}
                height={500}
                className="rounded-full border-4 border-slate-300 h-auto w-[250px] shadow-md object-cover"
              />
              <h2 className="text-3xl font-bold">Hi, I’m Mondrey 👋</h2>
              <p className="max-w-2xl">
                I’m the solo developer behind MondreyMD. I built this platform to make Markdown more
                accessible and collaborative, a tool that helps individuals and teams focus on their
                content, not their setup.
              </p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 w-full">
              <div className="md:order-2">
                <div className="flex items-center justify-center md:justify-start gap-5 mb-2 w-full ">
                  <div className="text-sm">Follow us on</div>
                  <Link href="https://github.com/e2e2a" rel="nofollow" target="_blank">
                    <div className="rounded-full border brder-white px-2 py-2">
                      <Github className="w-6 h-6 text-white hover:text-blue-600 transition" />
                    </div>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/reymond-godoy-5764b935a"
                    rel="nofollow"
                    target="_blank"
                  >
                    <div className="rounded-full border brder-white px-2 py-2">
                      <Linkedin className="w-6 h-6 text-white hover:text-blue-600 transition" />
                    </div>
                  </Link>
                  <Link
                    href="https://www.facebook.com/reymond.godoy.71"
                    rel="nofollow"
                    target="_blank"
                  >
                    <div className="rounded-full border brder-white px-2 py-2">
                      <Facebook className="w-6 h-6 text-white hover:text-blue-600 transition" />
                    </div>
                  </Link>
                  <Link href="https://portfolio.mondrey.dev" rel="nofollow" target="_blank">
                    <div className="rounded-full border brder-white px-2 py-2">
                      <Briefcase className="w-6 h-6 text-white hover:text-blue-600 transition" />
                    </div>
                  </Link>
                </div>
                <div className="text-center md:text-start pb-10 md:pb-0">
                  <p className="max-w-2xl text-sm">
                    For more inquries, please contact us at{' '}
                    <Link
                      href={'mailto:e2e2a@mondrey.dev'}
                      rel="nofollow"
                      className="hover:underline"
                    >
                      e2e2a@mondrey.dev
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="flex  justify-center items-center w-full md:order-1">
                <BodyPublicLink title="Join the Team" href={'#'} Icon={ArrowRight} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 mb-10 w-full rounded-3xl bg-white text-center">
          <div className="mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Investors</h2>
            <p className="text-gray-600 mb-8">
              We’re currently self-funded and focused on growth. Investor partnerships are on the
              horizon, if you believe in what we’re building, stay tuned or reach out to
              collaborate.
            </p>
            <div className="inline-block px-6 py-3 rounded-md bg-slate-200 text-slate-600 font-semibold">
              🚀 Coming Soon
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
