import Link from 'next/link';
import Image from 'next/image';
import { company, resources } from '@/data/footer';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
        <div className="mb-8 md:mb-0">
          {/* <h3 className="text-2xl font-bold mb-4">MondreyMD</h3> */}
          <Link
            href={'/'}
            className="text-xl lg:text-2xl gap-2 flex flex-col items-start font-extrabold tracking-tight"
          >
            <Image
              src="/images/logo.png"
              alt="Hero Background"
              width={500}
              height={500}
              className="h-9 w-9 rounded-sm"
            />
            <h3 className="text-2xl font-bold mb-4">MondreyMD</h3>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <div className="flex flex-col space-y-2">
            <span className="text-xl">Resources</span>
            {resources.map((data, idx) => (
              <Link key={idx} href={data.href} className="hover:text-blue-400 transition">
                {data.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xl">Company</span>
            {company.map((data, idx) => (
              <Link key={idx} href={data.href} className="hover:text-blue-400 transition">
                {data.title}
              </Link>
            ))}
            <Link
              href="https://github.com/e2e2a"
              rel="nofollow"
              className="hover:text-blue-400 transition"
              target="_blank"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
      <p className="text-center mt-12 text-gray-500">
        &copy; {new Date().getFullYear()} MondreyMD. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
