import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import { cn, truncateText, imageLinkParser } from "@/lib/utils";
import Link from "next/link";
import {  CATEGORIES_DICT } from "@/lib/variables";
import { useEvents } from "@/context/events";
import {  BsFilter } from "react-icons/bs";
// import Offcanvas from "react-bootstrap/Offcanvas";
import { AiFillHeart, AiOutlineClose } from "react-icons/ai";
import { StandardEventCard } from "@/components/cards";
import { useSession } from "next-auth/react";
import { userI } from "@/interfaces/index";
import { useBackend, useWindow } from "@/hooks";
// import { DatePicker } from "@";
import { EventsHomeSkeleton } from "@/components/skeleton/SkeletonComponent";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
// import HeroBanner from "@/components/compound/HeroBanner";
// import CategoriesSection from "@/components/compound/CategoriesSection";
import { TitleH1 } from "@/components/ui/TitleH1";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuLoader } from "react-icons/lu";
// import CallToAction from "@/components/compound/CallToAction";
import { useRouter } from "next/router";
import { FiltersProvider, useFilters } from "@/context/filters";
import { FiltersContainer } from "@/components/complex/FiltersContainer";
dayjs.locale("es-do");


export const getServerSideProps: GetServerSideProps = async () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Encoro",
    url: "https://www.encoro.app",
    logo: "https://www.encoro.app/logo.svg",
    sameAs: [
      "https://www.instagram.com/encoro.activities",
      "https://www.tiktok.com/@encoro.app",
      "https://www.facebook.com/profile.php?id=61560340678817",
    ],
    description:
      "Encuentra tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades.",
  };
  return {
    props: {
      schemaMarkup,
    },
  };
};
export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <FiltersProvider>
      <HomeContent {...props} />
    </FiltersProvider>
  );
}

function HomeContent(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    priceFilter,
    displayType,
    setDisplayType,
    eventsCategory,
  } = useFilters();
  const [events, setEvents] = useState<any>();
  const [showFilters, toggleShowFilters] = useState<boolean>(false);
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const { query } = useRouter();
  // This is specifically for when clicking load more
  const [isLoadingEvents, toggleLoadingEvents] = useState<boolean>(false);

  const { data: session } = useSession();
  const { windowWidth, resolution, isInViewport, scrollDirection: useWindowScrollDirection } =
    useWindow();
  const userInfo: userI | undefined = session?.user;
  const loadMoreRef = useRef<HTMLElement | null>(null);
  const [loadMoreEvents, setLoadMore] = useState<boolean>(false);
  const [currentPage, incrementCurrentPage] = useState<number>(1);
  const {
    date_filter,
    followEventsIds,
    location,
    setFollowedEventsIds,
  } = useEvents();
  const { get, destroy, post } = useBackend();
  const inRange = (x: number, min: number, max: number) => {
    return (x - min) * (x - max) <= 0;
  };

  const gridClassSorter = (index: number, length: number) => {
    let classResult = "grid-1";

    switch (index) {
      case 0:
        classResult = inRange(length - (index + 1), 0, 1) ? "grid-5" : "grid-1";
        break;
      case 1:
        classResult = "grid-2";
        break;
      case 2:
        classResult = inRange(length - (index + 1), 1, 2)
          ? "grid-3 special-grid  "
          : "grid-3";
        break;
      case 3:
        classResult = inRange(length - (index + 1), 0, 1)
          ? "grid-4 special-grid"
          : "grid-4";
        break;
      case 4:
        classResult = length === index + 1 ? "grid-2" : "grid-5";
        break;
      case 5:
        classResult = "grid-6";
        break;
      case 6:
        classResult = "grid-7";
        break;
      case 7:
        classResult = "grid-8";
        break;
      case 8:
        classResult = "grid-2";
        break;
      default:
        classResult = "grid-1";
    }
    return classResult;
  };

  const isToday = (date: string) => {
    return dayjs(date).format("MMMMM D") === dayjs().format("MMMMM D");
  };

  const fetchEvents = async (pageNumber = 1, by_country: boolean = false) => {
    let params: { [key: string]: string | number | Date } = {
      category: eventsCategory,
      date: date_filter ? date_filter : dayjs().format("YYYY-MM-DD"),
      page: pageNumber,
      fee_type: priceFilter,
    };

    if (location && location.city && !by_country) {
      params.city = location.city;
    }

    const { status, data } = await get("/api/events", { params });

    const today = dayjs();
    const yesterday = today.subtract(1, "day");
    const date_keys = Object.keys(data.events);
    const first_day_of_payload = dayjs(date_keys[0]);

    if (first_day_of_payload.isSame(yesterday, "day")) {
      delete data.events[date_keys[0]];
    }

    if (data.canPaginate) {
      setLoadMore(true);
    } else {
      setLoadMore(false);
    }

    return { status, data };
  };

  const fetchMoreEvents = async () => {
    toggleLoadingEvents(true);
    const { data } = await fetchEvents(
      currentPage + 1,
      location && location.cloud_lookup
    );

    if (data) {
      let updatedEvents = events;

      if (events[events.length - 1][0] === Object.keys(data.events)[0]) {
        updatedEvents[events.length - 1][1] = updatedEvents[
          events.length - 1
        ][1].concat(data.events[events[events.length - 1][0]]);
      }

      let results_arr = Object.entries(data.events);

      const [first, ...rest] = results_arr;

      if (results_arr.length > 0) setEvents([...updatedEvents, ...rest]);

      if (data.canPaginate) {
        setLoadMore(true);
        incrementCurrentPage(currentPage + 1);
      } else {
        setLoadMore(false);
      }
    }

    toggleLoadingEvents(false);
  };

  function handleScroll() {
    if (!loadMoreRef.current || !loadMoreEvents) return null;

    if (isInViewport(loadMoreRef.current) && loadMoreEvents) {
      setLoadMore(false);
      fetchMoreEvents();
    }
  }

  useEffect(() => {
    if (showFilters) {
      if (windowWidth < resolution["md"]) {
        // window.scrollTo(0, 0);
      }
      toggleShowFilters(false);
    }

    console.log({ location, date_filter });
    if (location)
      fetchEvents(1, location && location.cloud_lookup)
        .then(({ status, data }) => {
          if (status !== 200) return;

          if (data) {
            toggleLoading(false);
            setEvents(Object.entries(data.events));

            if (query.city || query.date) {
              const filters = document.querySelector(".filter-header");

              if (filters) {
                filters.scrollIntoView({ behavior: "smooth" });
              }
            }
          }
        })
        .catch((error) => {
          console.log({ error: error.message });
        });
  }, [location, eventsCategory, priceFilter, query.city, query.date]);

  useEffect(() => {
    if (events && events.length > 0)
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [events]);

  // Retrieve display type from session storage when the component mounts
  useEffect(() => {
    if (windowWidth > resolution["md"]) {
      const savedDisplayType = localStorage.getItem("displayType");
      setDisplayType(
        savedDisplayType && savedDisplayType !== "undefined"
          ? (savedDisplayType as "grid" | "card")
          : "grid"
      );
    }
  }, [windowWidth]);

  useEffect(() => {}, [query.city, query.date]);
  // Save display type to session storage when it changes
  useEffect(() => {
    if (windowWidth > resolution["md"]) {
      const savedDisplayType = localStorage.getItem("displayType");
      if (
        typeof savedDisplayType !== "undefined" &&
        displayType !== savedDisplayType
      ) {
        localStorage.setItem("displayType", displayType as "grid" | "card");
      }
    }
  }, [windowWidth, displayType]);

  const cardSwitcher = (printedGridClass: any, event: any) => {
    if (
      printedGridClass === "grid-3 special-grid" ||
      printedGridClass === "grid-4 special-grid" ||
      printedGridClass === "special-grid" ||
      printedGridClass === "grid-5"
    ) {
      return (
        <div className="event-card-text-lateral px-[20px] py-[20px] flex flex-column justify-content-end">
          <div>
            <Badge className={cn("mb-[12px]", `${event.category}-badge`)}>
              {CATEGORIES_DICT[event.category]}
            </Badge>
            <h2 className="subtitle text-white  mb-[12px]">{event.title}</h2>
            <span className="text-label text-white ">
              {truncateText(event.direction, 68)}
            </span>
          </div>
        </div>
      );
    }

    if (printedGridClass === "grid-1") {
      return (
        <div className="event-card-text px-[20px] py-[20px]">
          <h2 className="subtitle text-white text-shadow-lv1 mb-[12px]">
            {event.title}
          </h2>
          <div className="flex gap-[16px] align-items-center">
            <Badge className={cn("shadow-lv1", `${event.category}-badge`)}>
              {CATEGORIES_DICT[event.category]}
            </Badge>
            <span className="horizontal divider white h-[16px]"></span>
            <span className="text-label text-white text-shadow-lv1">
              {truncateText(event.direction, 68)}
            </span>
          </div>
        </div>
      );
    }

    if (
      printedGridClass !== "grid-1" ||
      printedGridClass !== "grid-4" ||
      printedGridClass !== "grid-5" ||
      printedGridClass !== "special-grid"
    ) {
      return (
        <div className="event-card-text px-[20px] py-[20px]">
          <Badge
            className={cn("shadow-lv1", "mb-[12px]", `${event.category}-badge`)}
          >
            {CATEGORIES_DICT[event.category]}
          </Badge>

          <h2 className="subtitle text-white text-shadow-lv1 mb-[12px]">
            {event.title}
          </h2>
          <div className="flex gap-[16px] align-items-center">
            <span className="text-label text-white text-shadow-lv1">
              {truncateText(event.direction, 68)}
            </span>
          </div>
        </div>
      );
    }
  };

  const followEvent = async (eventId: string, userId: string) => {
    if (followEventsIds.includes(eventId)) {
      const { status } = await destroy(`/api/unfollow-event`, {
        data: {
          user: userId,
          event: eventId,
        },
      });
      if (status === 200) {
        setFollowedEventsIds((ids: string[]) =>
          ids.filter((id: string) => id !== eventId)
        );
      }
    } else {
      const { status } = await post(`/api/follow-event`, {
        user: userId,
        event: eventId,
      });

      if (status === 201) {
        setFollowedEventsIds([...followEventsIds, eventId]);
      }
    }
  };

  return (
    <>
      <Head>
        <title>
          Encuentra tus actividades favoritas: bares, restaurantes, tourismo,
          conciertos, etc. - Encoro
        </title>

        <meta
          name="description"
          content="Encuentra tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades."
        />
        <meta
          name="keywords"
          content="actividades, eventos, bares, restaurantes, tourism, concerts, discotecas, encuentra"
        />
        {/* <meta name='robots' content='index, follow' /> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://encoro.app/" />
        <link rel="canonical" href="https://encoro.app/" />
        <meta
          property="og:title"
          content="Encuentra tus actividades favoritas - Encoro"
        />
        <meta
          property="og:description"
          content="Encuentra tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades."
        />
        <meta
          property="og:image"
          content="https://encoro.app/images/encoro-cover.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Encuentra tus actividades favoritas - Encoro"
        />
        <meta
          name="twitter:description"
          content="Encuentra  tus activides favoritas en tu ciudad, filtradas por categoría y fecha. Busca eventos cerca de ti y sigue a los que te interesen para estar al tanto de las últimas novedades."
        />
        <meta
          name="twitter:image"
          content="https://encoro.app/images/encoro-cover.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script
          className="saswp-schema-markup-output"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(props.schemaMarkup),
          }}
        />
      </Head>
      <HeroBanner />
      {/* <CategoriesSection /> */}

      <Container className="bg-white border-y border-slate-100" variant="sm">
        <TitleH1 className="text-left mb-0">Sucediendo cerca de ti</TitleH1>
      </Container>

      <FiltersContainer />

      <section className="events-container">
        <div className="container 2xl:px-0">
          {isLoading ? (
            <EventsHomeSkeleton />
          ) : events && events.length ? (
            events.map((event_group: any, index: number) => {
              let forClassIndex = 0;
              return (
                <section key={index} className="mb-[32px] lg:mb-[64px]">
                  <h2 className="heading mb-[16px] lg:mb-[24px]">
                    {isToday(event_group[0])
                      ? "Hoy"
                      : dayjs(event_group[0]).locale(es).format("MMMM D")}
                  </h2>
                  <div
                    className={`cols grid-area ${
                      displayType === "card" ? "for-standard-cards" : ""
                    }`}
                  >
                    {event_group[1].map((event: any, j: number) => {
                      const isFollowed = followEventsIds.includes(event.id);

                      if (displayType === "card" || windowWidth < resolution.lg)
                        return (
                          <StandardEventCard
                            key={index + "-" + event.id}
                            {...event}
                            isFollowed={isFollowed}
                            loggedUser={
                              session && session.user ? userInfo?.id : null
                            }
                            image={imageLinkParser(event.media)[0]}
                            onFollowAction={() => {
                              if (session && userInfo)
                                followEvent(event.id, userInfo.id!);
                            }}
                          />
                        );
                      const gridClass = gridClassSorter(
                        forClassIndex,
                        event_group[1].length
                      );
                      forClassIndex += 1;

                      if (forClassIndex == 8) forClassIndex = 0;

                      const imageUrl = imageLinkParser(event.media)[0];

                      return (
                        <Link
                          key={j}
                          className={`card  event-card col ${
                            event_group[1].length === 1 ? "grid-2" : gridClass
                          }`}
                          href={`/${event.category}/${event.id}`}
                          target={
                            windowWidth > resolution.lg ? "_blank" : "_blank"
                          }
                        >
                          <img
                            src={`https://encoro.app/cdn-cgi/image/quality=85,format=webp/${imageUrl}?width=${
                              gridClass === "grid-1" ? 869 : 426
                            }&format=webp"`}
                            alt={event.id + " Image"}
                            loading="lazy"
                            width={gridClass === "grid-1" ? 869 : 426}
                            height={gridClass === "grid-3" ? 620 : 300}
                          />

                          {event_group[1].length === 1
                            ? cardSwitcher("grid-2", event)
                            : cardSwitcher(gridClass, event)}

                          {session && userInfo && (
                            <Button
                              className={cn(`follow-btn`, {
                                followed: isFollowed,
                              })}
                              onClick={(e) => {
                                followEvent(event.id, userInfo.id!);
                                e.currentTarget.blur();
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              <AiFillHeart size={36} />
                            </Button>
                          )}
                        </Link>
                      );
                      // }
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="flex flex-col justify-center max-w-[600px] mx-auto py-[64px] lg:py-[80px] mb-[124px]">
              <img
                src="/images/illustration/location_404.svg"
                alt=""
                className="h-[272px] max-w-[362px] mx-auto mb-[32px]"
              />

              <h3 className="text-[32px] text-center font-light leading-normal !text-slate-500 mb-0">
                Actualmente no tenemos eventos en esta
                <b className="text-slate-900">
                  {" "}
                  <u>categoria, ubicacion o fecha </u>
                </b>
              </h3>
            </div>
          )}

          {loadMoreEvents ? (
            <div className="loading-container mb-[32px]">
              {!isLoadingEvents ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-lg"
                  onClick={() => fetchMoreEvents()}
                >
                  Cargar Más Eventos!
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-xl px-0 w-[232px]"
                  disabled
                >
                  <LuLoader className="animate-spin" />
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* <CallToAction /> */}

      <Button
        className={cn("filters-fab ", {
          "z-[100]": showFilters,
        })}
        onClick={() => toggleShowFilters(!showFilters)}
      >
        {!showFilters ? <BsFilter size={32} /> : <AiOutlineClose size={24} />}
      </Button>
      {/* 
      <Offcanvas
        show={showFilters}
        onHide={toggleShowFilters}
        placement="bottom"
      >
        <Offcanvas.Body>
          <h3 className="text-lg font-semibold mb-[16px]">Filtros</h3>

          <hr className="border-slate-300 opacity-100 mb-[32px]" />

          <div className="mb-[32px]">
            <label
              htmlFor="filter-location-picker"
              className="text-base  mb-[8px] font-semibold text-slate-900"
            >
              Seleccionar ciudad
            </label>
            <div
              id="filter-location-picker"
              className="border-[1px] border-slate-300 flex items-center px-[12px] rounded-[8px]"
            >
              <SearchForCity
                fluid
                citiesList={availableCities}
                defaultValue={
                  location && !location.cloud_lookup
                    ? location.city
                    : All_PLACES
                }
                className="off-canvas-location-input"
                clearLocation={clearLocation}
                showClearFilter={showClearFilter}
                onChangeLocation={(props) => {
                  setLocation(props);
                  toggleClearFilter(true);
                }}
              />
            </div>
          </div>

          <div className="mb-[32px]">
            <label
              htmlFor="filter-date-picker"
              className="text-base  mb-[8px] font-semibold text-slate-900"
            >
              Fecha especifica
            </label>
            <div id="filter-date-picker">
              <DatePicker
                className="border-[1px] border-slate-300 flex items-center  rounded-[8px] h-[40px] relative"
                seletedDate={date_filter}
                handleDateChange={async (date: any) => {
                  setDateFilter(
                    date ? dayjs(date).format("YYYY-MM-DD") : undefined
                  );
                  await setTimeout(() => toggleShowFilters(!showFilters), 500);

                  windowWidth < resolution.lg && window.scrollTo(0, 0);
                }}
              />
            </div>
          </div>

          <div className="mb-[32px]">
            <label
              htmlFor="filter-assistance-type"
              className="text-base  mb-[8px] font-semibold text-slate-900"
            >
              Tipo de asistencia
            </label>

            <div id="filter-assistance-type">
              <ToggleButtonGroup
                type="radio"
                defaultValue={priceFilter}
                name="fee-type-toggle"
                onChange={setPriceFilter}
              >
                <ToggleButton id="tbg-check-1" className="text-sm" value="all">
                  Todos
                </ToggleButton>
                <ToggleButton id="tbg-check-2" className="text-sm" value="free">
                  Gratis
                </ToggleButton>
                <ToggleButton id="tbg-check-3" className="text-sm" value="pay">
                  Pago
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {date_filter ||
          (location &&
            !["Santo Domingo"].includes(location.city) &&
            location.city !== "") ? (
            <Button
              variant="outline-secondary"
              onClick={() => {
                clearLocation();
                setDateFilter(undefined);
              }}
              className=" mr-auto size-[14px] px-[12px] max-h-[36px] font-semibold"
            >
              Limpiar filtros
            </Button>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas> */}
    </>
  );
}
