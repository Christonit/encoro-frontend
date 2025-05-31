import { Container } from "@/components/ui/container";
import { TitleH1 } from "@/components/ui/TitleH1";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useEvents } from "@/context/events";
import debounce from "lodash/debounce";
import { StandardEventCard } from "../cards";
import {
  EventSearchResultType,
  EventStandardCardI,
  eventModelI,
} from "@/interfaces";
import dayjs from "dayjs";
import { Button } from "../ui/button";
import DateLocationSearchComponent from "../DateAndLocationInlined";
import { useSession } from "next-auth/react";
import Link from "next/link";
import cx from "classnames";

export default function HeroBanner() {
  const {
    supabase,
    // setDateFilter,
    // date_filter,
  } = useEvents();

  const [test, setTest] = useState(1);

  const [search_results, setSearchResults] = useState<
    EventSearchResultType[] | undefined
  >();

  const [events, setEvents] = useState<EventStandardCardI[]>([]);
  const [date_filter, setDateFilter] = useState<Date | undefined>();
  const [location, setLocation] = useState("");
  const homeActions = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const router = useRouter();

  const fetchEventsBySearch = debounce(async (query: string) => {
    if (!query || query.length < 3) {
      return { data: [], error: "Query must be at least 3 characters long" };
    }

    const today = dayjs().startOf("day").toISOString();
    const { data, error } = await supabase
      .from("events")
      .select("id,media,title,category,date,time")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .gte("date", today)
      .order("date")
      .limit(10); // Limit results to 10 items

    console.log({ data, error });

    if (error) {
      console.error("Error fetching events:", error);
      return { data: [], error };
    }

    const results = data.map((event: any) => ({
      ...event,
      image: event.media ? event.media[0] : "",
    }));

    console.log({ results });
    setSearchResults(data);
  }, 300);

  const fetchEvents = async () => {
    let { data: events, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .limit(20);

    if (error) {
      console.log("Error Fetching Top 20 Events in Hero Banner", error);
    }

    const newEvents = events.map((event: eventModelI) => ({
      ...event,
      image: event.media ? event.media[0] : "",
    }));

    setEvents(newEvents);

    setIsLoading(false);
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log({ date_filter, location });
  }, [date_filter, location]);
  return (
    <>
      <Container id="hero-banner" className="py-6 lg:pt-12 lg:pb-0">
        <div className="flex flex-col justify-center items-center gap-3 lg:gap-8 w-full max-w-[820px] mx-auto">
          <TitleH1 className="text-center mb-0 leading-none">
            No te pierdas tus actividades favoritas
          </TitleH1>

          <p className="hidden lg:block lg:text-neutral-900 text-xl lg:text-2xl  text-center leading-normal mb-3">
            {" "}
            Este es tu directorio definitivo para encontrar lo que quieres
            hacer, crear tu agenda de tus actividades, seguir tus organizadores
            favoritos y mucho más.
          </p>

          <div className="flex gap-3 lg:gap-4 flex-col items-center w-full">
            <DateLocationSearchComponent
              isOnHeader={false}
              ref={homeActions}
              selectedDay={date_filter}
              defaultCity={location}
              handleLocationChange={(location: any) =>
                setLocation(location.city)
              }
              handleDateChange={(date: any) => {
                if (!date) {
                  setDateFilter(undefined);
                  return;
                }
                setDateFilter(dayjs(date).toDate());
              }}
              handleOnSearch={(payload) => fetchEventsBySearch(payload.q)}
              searchResults={search_results}
            />

            <div className={cx("w-full  justify-center gap-3 flex")}>
              {location || date_filter ? (
                <Button
                  className=" w-full lg:max-w-[180px]"
                  variant="outline"
                  onClick={() => {
                    console.log({ date_filter, location });

                    let param: any = {};

                    if (location) param.location = location;
                    if (date_filter) {
                      const date_params =
                        dayjs(date_filter).format("YYYY-MM-DD");
                      param.date = date_params;
                    }

                    router.push({
                      pathname: router.pathname,
                      query: {
                        ...param,
                      },
                    });
                  }}
                >
                  Buscar
                </Button>
              ) : null}
              {!session && (
                <Button className=" w-full lg:max-w-[180px]" asChild>
                  <Link href="/login">Unirme a Encoro</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
      <section id="hero-banner-carousel" className="py-12 overflow-hidden">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full pl-4 lg:pl-5"
        >
          {!isLoading && events.length > 0 ? (
            <CarouselContent className="px-4 ml-0">
              {events.map((event) => (
                <CarouselItem
                  key={event.id}
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  <StandardEventCard {...event} />
                </CarouselItem>
              ))}
            </CarouselContent>
          ) : (
            <CarouselContent className="px-4 ml-0">
              {[1, 2, 3, 4, 5, 6].map((event) => (
                <CarouselItem
                  key={event}
                  className="md:basis-1/2 lg:basis-1/4 2xl:basis-1/5 3xl:basis-1/6"
                >
                  <div className="animate-pulse bg-white rounded-lg h-[300px] w-full "></div>
                </CarouselItem>
              ))}
            </CarouselContent>
          )}
        </Carousel>
      </section>
    </>
  );
}
