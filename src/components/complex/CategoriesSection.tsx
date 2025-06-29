import { Container } from "@/components/ui/container";
import { TitleH1 } from "@/components/ui/TitleH1";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useContext, useEffect, useRef, useState } from "react";
import { useEvents } from "@/context/events";

import dayjs from "dayjs";
import { $axios } from "@/lib/utils";
import { Card } from "../ui/card";
import { CATEGORIES_DICT } from "@/lib/variables";
import Image from "next/image";
import Link from "next/link";
import { useWindow } from "@/hooks";

export default function CategoriesSection() {
  const { supabase } = useEvents();
  const { windowWidth, resolution } = useWindow();
  const [category_counts, setCategoryCounts] = useState<{
    [key: string]: number;
  }>();

  const computeEventsCount = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("category, date", { count: "exact" })
        .gte("date", dayjs().startOf("day").toISOString());

      if (error) {
        console.log("Error Fetching Top 20 Events in Hero Banner", error);
      }

      const categories = new Set(data.map((event: any) => event.category));
      const categoryCounts = Array.from(categories).map((category) => {
        const count = data.filter(
          (event: any) => event.category === category
        ).length;
        return { category, count };
      });

      const dictionary = Object.fromEntries(
        categoryCounts.map((item) => [item.category, item.count])
      );

      setCategoryCounts(dictionary);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const categoryCard = ({ category }: { category: string }) => {
    if (!category_counts) return <></>;
    return (
      <Link href={`/${category}/`} key={category} className="no-underline">
        <Card className="px-3 lg:px-[20px] pt-3 pb-3 lg:pb-[20px] rounded-2xl hover:bg-slate-50">
          <div className="flex justify-between text-slate-900 mb-2">
            <span className="font-bold text-xl leading-none">
              {CATEGORIES_DICT[category]}
            </span>
            <span className="font-regular text-slate-500 text-base">
              {category_counts[category]}
            </span>
          </div>

          <Image
            src={`/images/category/${category}-1.webp`}
            width={320}
            height={200}
            alt=""
            className="rounded-2xl w-full"
          />
        </Card>
      </Link>
    );
  };

  useEffect(() => {
    computeEventsCount();
  }, []);

  return (
    <>
      <Container className="bg-white lg:px-[20px] 2xl:px-0 overflow-hidden">
        <div className="flex flex-col  items-start gap-6 lg:gap-8 mb-4 lg:mb-5 max-w-[692px]">
          <TitleH1 className="mb-0">
            Una actividad para todas los gustos
          </TitleH1>

          <p className="text-neutral-500 text-xl leading-normal mb-0">
            Descubre contenido adaptado a tus intereses. Navega a través de
            varias categorías y encuentra exactamente la actividad que
            necesitas,{" "}
            <span className="text-slate-900"> ¡Sumérgete y explora!</span>
          </p>
        </div>

        {category_counts &&
          (windowWidth > resolution.sm ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryCard({ category: "music" })}
              {categoryCard({ category: "nightlife" })}
              {categoryCard({ category: "gastronomy" })}
              {categoryCard({ category: "art" })}
              {categoryCard({ category: "tourism" })}
              {categoryCard({ category: "wellness" })}
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={
                [
                  // Autoplay({
                  //   delay: 3000,
                  // }),
                ]
              }
              className="w-full"
            >
              <CarouselContent className="px-4 ml-0">
                <CarouselItem
                  key="music"
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  {categoryCard({ category: "music" })}
                </CarouselItem>
                <CarouselItem
                  key="nightlife"
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  {categoryCard({ category: "nightlife" })}
                </CarouselItem>
                <CarouselItem
                  key="gastronomy"
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  {categoryCard({ category: "gastronomy" })}
                </CarouselItem>
                <CarouselItem
                  key="concerts"
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  {categoryCard({ category: "concerts" })}
                </CarouselItem>
                <CarouselItem
                  key="tourism"
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  {categoryCard({ category: "tourism" })}
                </CarouselItem>
                <CarouselItem
                  key="theater"
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  {categoryCard({ category: "theater" })}
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          ))}
      </Container>
    </>
  );
}
