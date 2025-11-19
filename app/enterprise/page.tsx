import Navbar from '@/components/public-pages/navbar';
import Footer from '@/components/public-pages/footer';
import { ArrowRight } from 'lucide-react';
import BodyPublicLink from '@/components/public-pages/body-public-link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { IconFileText, IconUserPlus, IconUsers } from '@tabler/icons-react';
import { Metadata } from 'next';
const teamFeatures = [
  {
    title: 'Real-Time Team Collaboration',
    description:
      'Work together on Markdown documents in real-time. Your team can edit and see changes instantly, making collaboration simple and seamless.',
    icon: IconUsers,
  },
  {
    title: 'Organized Project Files',
    description:
      'Keep your documents structured and easy to access. Your team can create, organize, and navigate files effortlessly.',
    icon: IconFileText,
  },
  {
    title: 'Invite Team Members',
    description:
      'Easily invite colleagues to your project. Collaborate on documents with your team instantly, without complex setup or permissions.',
    icon: IconUserPlus,
  },
];

export const metadata: Metadata = {
  title: 'Enterprise Collaboration for Teams and Markdown Projects',
  description:
    'Discover enterprise features for real-time Markdown collaboration. Empower your team to create, share, and work together efficiently online.',
};

export default function EnterprisePage() {
  return (
    <div className="h-auto bg-gray-200">
      <Navbar />

      {/* Hero Section */}
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
                  MondreyMD for Teams & Enterprises
                </h1>
                <p className="text-sm md:text-[16px] text-slate-200 drop-shadow-md">
                  Streamline your team’s Markdown workflow, collaborate in real-time, and manage
                  your documents securely with MondreyMD Enterprise.
                </p>
                <div className="pb-15">
                  <BodyPublicLink title="Get Started For Free" href={'/login'} Icon={ArrowRight} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 rounded-3xl max-w-5xl bg-white flex flex-col items-center text-center px-6 lg:px-0">
          <h2 className="text-4xl font-bold mb-6">Enterprise Features</h2>
          <p className="text-gray-600 max-w-3xl mb-12">
            Designed for teams of all sizes, MondreyMD Enterprise offers advanced collaboration,
            security, and administrative tools to keep your workflow organized and efficient.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-6">
            {teamFeatures.map((feature, idx) => (
              <Card
                key={idx}
                className="flex flex-col items-start p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 p-3 bg-blue-600/90 rounded-xl">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Security & Collaboration Section */}
        <section className="relative py-10 rounded-3xl w-full flex items-center justify-center bg-linear-to-r from-slate-900 via-blue-950 to-blue-800 text-white mb-8">
          <div className="relative px-6 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
              Security & Collaboration You Can Trust
            </h2>
            <p className="text-gray-300 text-sm md:text-[16px] leading-relaxed max-w-2xl">
              Enterprise-grade encryption, permission management, and team collaboration features
              ensure that your content stays safe while your team works seamlessly together.
            </p>
            <BodyPublicLink title="Request a Demo" href={'/login'} />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
