import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState, useRef } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useSession } from "next-auth/react";
import { useWindow } from "@/hooks";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { CategoriesRack } from "@/components/CategoriesRack";
import { MdFilterList } from "react-icons/md";
import { useEvents } from "@/context/events";
import FollowedProfileCard from "@/components/cards/FollowedProfileCard";
import { eventI, followedProfileI } from "@/interfaces";
import { CATEGORIES_DICT } from "@/lib/variables";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface userI {
  name?: string | null | undefined;
  id?: string | null | undefined;
  email?: string | null | undefined;
  phone_number?: string | null | undefined;
  social_networks?: string | null | undefined;
  image?: string | null | undefined;
  business_picture?: string | null;
  [x: string]: any;
}

dayjs.locale("es-do");
dayjs.extend(isSameOrAfter);

export async function getServerSideProps(context: { req: any }) {
  const session = await getSession({ req: context.req });
  // If the user is not authenticated, redirect to the home page
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

const MyScheduledEvents = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/");
  }
  const router = useRouter();
  const [categories, setCategories] = useState<any>([]);
  const [showFilters, toggleShowFilters] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<userI>();
  const categoryCounter = useRef<HTMLDivElement | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<{
    [key: string]: number;
  }>({});
  const [selected_city, setSelectedCity] = useState<string>("all");
  const { windowWidth, resolution } = useWindow();
  const { followedOrganizers } = useEvents();
  const [selected_category, setSelectedCategory] = useState<string>("all");
  const [cities, setCities] = useState<string[]>([]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    router.push(
      {
        pathname: router.pathname,
        query: {
          category,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const getCities = () => {
    const arr: string[] = [];

    followedOrganizers.forEach((organizer: followedProfileI) => {
      if (!organizer.events || organizer.events.length === 0) return;

      organizer.events.forEach((event: eventI) => {
        if (!arr.includes(event.city!)) {
          arr.push(event.city!);
        }
      });
    });

    return arr;
  };

  const getCategories = () => {
    const arr: string[] = [];

    followedOrganizers.forEach((organizer: followedProfileI) => {
      if (!organizer.events || organizer.events.length === 0) return;

      organizer.events.forEach((event: eventI) => {
        if (!arr.includes(event.category!)) {
          arr.push(event.category!);
        }
      });
    });

    return arr;
  };

  const getOrganizers = () => {
    const arr =
      selected_city === "all"
        ? followedOrganizers
        : followedOrganizers.filter((organizer: followedProfileI) =>
            organizer.location.includes(selected_city)
          );

    return arr.map((organizer: followedProfileI) => {
      const arr = selected_city === "all" ? organizer : [selected_city];
      if (selected_city)
        if (organizer.events && organizer.events.length === 0) return null;
      if (selected_category === "all")
        return <FollowedProfileCard {...organizer} />;

      const hasMatchingEvent = organizer.events!.some(
        (event: eventI) => event.category === selected_category
      );
      return hasMatchingEvent ? <FollowedProfileCard {...organizer} /> : null;
    });
  };

  useEffect(() => {
    if (session?.user && session.user.name) {
      setUserInfo(session["user"]!);
    }
  }, [session]);

  useEffect(() => {
    if (followedOrganizers) {
      const categories = getCategories();
      const cities = getCities();
      setCities(cities);

      const categories_list = categories.map((category: string) => {
        return {
          value: category,
          label: CATEGORIES_DICT[category],
        };
      });
      setCategories(categories_list);
    }
  }, [followedOrganizers]);

  return (
    <div>
      <Head>
        <title>Mi calendario de actividades - Encoro</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <section className="my-schedule-hero-banner">
        <div className="flex w-full items-end lg:min-h-[324px]">
          <div className="mb-8 px-3 lg:mt-0">
            <h1 className="mb-0 text-2xl font-semibold text-white lg:text-5xl">
              Tus organizadores seguidos
            </h1>
          </div>
        </div>
      </section>

      <section className="events-header">
        <div className="py-4">
          <div className="mx-auto flex w-full flex-wrap">
            <div className="flex w-full items-center gap-8">
              <div className="flex w-auto items-end gap-2 lg:mr-8">
                <div className="text-center text-lg leading-none text-slate-700">
                  Seguidos
                </div>

                <div className="text-center text-xl font-semibold leading-none text-slate-900">
                  {followedOrganizers.length}
                </div>
              </div>

              {windowWidth < resolution.lg ? (
                <button
                  onClick={() => toggleShowFilters(true)}
                  className="ml-auto flex items-center gap-2 rounded bg-slate-100 px-2 py-1 text-slate-900"
                >
                  Filtros <MdFilterList />
                </button>
              ) : (
                <>
                  <CategoriesRack
                    onClickHandler={handleCategoryClick}
                    activeCategory={selected_category}
                    categories={[
                      {
                        value: "all",
                        label: "Todas las categorías",
                      },
                      ...categories,
                    ]}
                  />

                  <div className="ml-auto flex w-full max-w-[296px] items-center gap-2">
                    <Label>Ubicación</Label>
                    <Select
                      value={selected_city}
                      onValueChange={(value) => setSelectedCity(value)}
                    >
                      <SelectTrigger className="bg-slate-100">
                        <SelectValue placeholder="Seleccionar ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {cities.map((city: string) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 py-5 lg:py-14">
            {followedOrganizers.length > 0 ? (
              getOrganizers()
            ) : (
              <div>
                <img
                  src="/images/illustration/no-agenda.svg"
                  className="mx-auto mb-8 w-full max-w-[200px] md:max-w-[400px]"
                />
                <h1 className="mb-4 text-center text-2xl font-semibold normal-case lg:mb-6 lg:text-3xl">
                  No sigues a nadie
                </h1>

                <p className="mb-0 text-center text-base font-light leading-normal text-slate-500 lg:text-2xl">
                  Actualmente no estas dando seguimiento a ningun organizador.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Sheet open={showFilters} onOpenChange={toggleShowFilters}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>

          <hr className="mb-8 border-slate-300 opacity-100" />

          <div className="mb-8">
            <Label
              htmlFor="filter-location-picker"
              className="mb-2 text-base font-semibold text-slate-900"
            >
              Ciudad
            </Label>

            <Select
              value={selected_city}
              onValueChange={(value) => {
                setSelectedCity(value);
                toggleShowFilters(false);
              }}
            >
              <SelectTrigger className="bg-slate-100">
                <SelectValue placeholder="Seleccionar ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {cities.map((city: string) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-8">
            <Label
              htmlFor="filter-location-picker"
              className="mb-2 text-base font-semibold text-slate-900"
            >
              Categoria
            </Label>

            <div className="flex flex-wrap gap-3">
              <Button
                variant={selected_category === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  handleCategoryClick("all");
                  toggleShowFilters(false);
                }}
              >
                Todas
              </Button>
              {categories.map((category: { label: string; value: string }) => (
                <Button
                  key={category.value}
                  variant={selected_category === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    handleCategoryClick(category.value);
                    toggleShowFilters(false);
                  }}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MyScheduledEvents;
