'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { industries } from '@/data/industries';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
const CarouselSection = () => {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <section className="py-10 rounded-3xl w-full flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
        Markdown Solutions for Every Industry
      </h2>

      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full max-w-4xl"
      >
        <CarouselContent>
          {industries.map((industry, idx) => {
            const Icon = industry.icon;
            return (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                      <Icon className="text-blue-600" size={48} />
                      <h3 className="text-xl font-semibold text-center">{industry.title}</h3>
                      <p className="text-gray-600 text-center">{industry.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden lg:flex justify-between mt-4 w-full px-4">
          <CarouselPrevious className="btn btn-outline">Prev</CarouselPrevious>
          <CarouselNext className="btn btn-outline">Next</CarouselNext>
        </div>
      </Carousel>
    </section>
  );
};

export default CarouselSection;
