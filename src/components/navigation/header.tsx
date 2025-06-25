import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  AiOutlineMenu,
  AiOutlineSetting,
  AiFillBell,
  AiOutlineArrowLeft,
  AiOutlineSearch,
} from "react-icons/ai";

import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";

import Link from "next/link";
import DateLocationFilter from "@/components/DateAndLocationDesktop";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useEvents } from "@/context/events";
import {
  UserNotificationType,
  userI,
  EventSearchResultType,
} from "@/interfaces";
import dayjs from "dayjs";
import { useBackend, useWindow } from "@/hooks";

import { cn } from "@/lib/utils";
import NotificationItem from "@/components/notifications/NotificationItem";
import SearchResultItem from "@/components/ui/search-result-item";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { LuCalendarDays, LuUser } from "react-icons/lu";

const CATEGORY_PILLS = [
  { label: "Todas las categorías", value: "all" },
  { label: "Música", value: "music" },
  { label: "Arte", value: "art" },
  { label: "Turismo", value: "tourism" },
  { label: "Deportes", value: "sports" },
  { label: "Teatro", value: "theater" },
  { label: "Vida nocturna", value: "nightlife" },
  { label: "Conciertos", value: "concerts" },
  // Add more as needed
];

const FEE_PILLS = [
  { label: "Todos", value: "all" },
  { label: "Gratis", value: "free" },
  { label: "Pago", value: "paid" },
];

export function useThrottledScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    console.log("Whatsup");
    console.log({ scrollY });
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

const Header = () => {
  const { patch, get } = useBackend();
  const { resolution, windowWidth, scrollDirection, scrollPos } = useWindow();
  const backBtn = useRef<HTMLButtonElement | null>(null);
  const homeActions = useRef<HTMLDivElement | null>(null);
  const [showMobileNav, toggleMobileNav] = useState<boolean>(false);
  const [search_mobile, toggleSearchMobile] = useState<boolean>(false);
  const [scrollDirectionValue, setScrollDirectionValue] = useState<
    null | string
  >(null);
  const { push, pathname } = useRouter();
  const { data: session } = useSession();
  const [shouldActionsBar, setShouldShowActionsBar] = useState(() => {
    if (pathname === "/") return true;
    return false;
  });
  const { user_notifications, setUserNotifications, date_filter } = useEvents();
  const [params, setParams] = useState<{
    location?: string;
    date?: string;
  } | null>(null);

  const [has_new_notifs, setHasNewNotifs] = useState<boolean>(false);
  const [notifications_modal, toggleNotificationsModal] =
    useState<boolean>(false);

  // This is to show or hide background and searchbar and date selection on the header when we are at homepage
  const [isOnTopScrollOnHome, setIsOnTopScrollOnHome] = useState<boolean>(true);
  const customDropdown = useRef<HTMLDivElement | null>(null);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const user: userI | undefined = session?.user;
  const [search_results, setSearchResults] = useState<
    EventSearchResultType[] | undefined
  >();

  const [agendaMenuOpen, setAgendaMenuOpen] = useState(false);

  const backButtonPositioner = (
    refElement: HTMLButtonElement | HTMLDivElement | null,
    elementToTrackSelector: string = "#main-content"
  ) => {
    const container = document.querySelector(
      elementToTrackSelector
    ) as HTMLElement;

    if (window.innerWidth < resolution["3xl"] && refElement && container) {
      if (refElement.classList.contains("absolute")) {
        refElement.classList.remove("absolute");
      }
    }
    if (window.innerWidth >= resolution["3xl"] && refElement && container) {
      if (!refElement.classList.contains("absolute")) {
        refElement.classList.add("absolute");
      }
      const leftPos = container!.offsetLeft;
      refElement.style.left = leftPos + (shouldActionsBar ? 0 : 16) + "px";
    }
  };

  const updateNotifications = () => {
    if (has_new_notifs) {
      patch(`/api/notifications/${user!.id}`, {
        notifications: user_notifications
          .filter((n: UserNotificationType) => n.seen === false)
          .map((n: UserNotificationType) => n.id),
      }).then((res: { status: number }) => {
        if (res.status === 200) {
          const updated_notifs = user_notifications.map(
            (notification: UserNotificationType) => ({
              ...notification,
              seen: true,
            })
          );
          setUserNotifications([...updated_notifs]);
        }
      });
    }

    return;
  };

  const closeNotificationsModal = () => {
    updateNotifications();
    toggleNotificationsModal(false);
  };

  const queryForEvents = (e: { q: string; city?: string }) => {
    if (e.q.length === 0) {
      setSearchResults(undefined);
      return;
    }
    if (e.q.length > 3)
      get(`/api/search-events`, {
        params: {
          q: e.q,
        },
      }).then((res) => {
        if (res.status === 200) {
          setSearchResults(res.data.data);
        }
        console.log({ res });
        // setEvents(res.data)
      });
  };

  const handleInputSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryForEvents({ q: e.target.value });
  };

  const handleSearchClose = () => {
    toggleSearchMobile(false);
    setSearchResults(undefined);
  };

  useEffect(() => {
    if (searchInput.current && search_mobile) {
      setTimeout(() => {
        searchInput.current!.focus();
        searchInput.current!.selectionStart =
          searchInput.current!.selectionEnd = 10000;
      }, 1000);
    }
  }, [searchInput, search_mobile]);

  useEffect(() => {
    if (params) {
      let queryParams = {};
      console.log({ params });
      if (params.location) {
        queryParams = {
          ...queryParams,
          location: params.location,
        };
      }
      if (params.date) {
        queryParams = {
          ...queryParams,
          date: params.date,
        };
      }

      push({
        query: queryParams,
      });
    }
  }, [params]);

  useEffect(() => {
    console.log("MOunt-unmount");
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setShouldShowActionsBar(true);
    } else {
      setShouldShowActionsBar(false);

      let pathLabel = "";
      switch (pathname) {
        case "/[category]/[post]":
          pathLabel = "Detalles del Evento";
          break;
        case "/activity/create":
          pathLabel = "Crear Evento";
          break;
        // case "/activity/[post]/edit":
        //   pathLabel = "Actualizar Evento";
        //   break;
        case "/user/settings":
          pathLabel = "Mi Perfil";
          break;
        case "/user/my-events":
          pathLabel = "Mis Eventos";
          break;
        case "/user/my-schedule":
          pathLabel = "Mi Agenda";
          break;
        case "/my-calendar":
          pathLabel = "Mi Agenda";
          break;
        default:
          pathLabel = "";
          break;
      }
    }
  }, [pathname, backBtn]);

  useEffect(() => {
    if (backBtn.current) {
      backButtonPositioner(backBtn.current);
      window.addEventListener("resize", () =>
        backButtonPositioner(backBtn.current)
      );
    }

    return () => {
      window.removeEventListener("resize", () =>
        backButtonPositioner(backBtn.current)
      );
    };
  }, [backBtn.current, pathname]);
  useEffect(() => {
    if (pathname === "/" && shouldActionsBar && homeActions.current) {
      backButtonPositioner(homeActions.current, ".filter-header-container");

      window.addEventListener("resize", () =>
        backButtonPositioner(homeActions.current, ".filter-header-container")
      );

      return () => {
        window.removeEventListener("resize", () =>
          backButtonPositioner(homeActions.current, ".filter-header-container")
        );
      };
    }
    if (pathname !== "/" && !shouldActionsBar && backBtn.current) {
      backButtonPositioner(backBtn.current);

      window.addEventListener("resize", () =>
        backButtonPositioner(backBtn.current)
      );

      return () => {
        window.removeEventListener("resize", () =>
          backButtonPositioner(backBtn.current)
        );
      };
    }
  }, [shouldActionsBar, homeActions.current, pathname, backBtn]);

  useEffect(() => {
    if (pathname === "/") {
      setScrollDirectionValue(scrollDirection);
    } else {
      setScrollDirectionValue(null);
    }
  }, [scrollDirection, pathname]);

  useEffect(() => {
    if (pathname === "/" && shouldActionsBar) {
      const shouldBeOnTop = scrollPos < 300;
      if (isOnTopScrollOnHome !== shouldBeOnTop) {
        setIsOnTopScrollOnHome(shouldBeOnTop);
      }
    }
  }, [shouldActionsBar, pathname, scrollPos, isOnTopScrollOnHome]);

  const mobileButtonHandler = (route: string) => {
    toggleMobileNav(false);
    push(route);
  };

  useEffect(() => {
    if (user_notifications.length > 0) {
      const has_new_notifs = user_notifications.some(
        (notif: UserNotificationType) => notif.seen === false
      );

      console.log({ has_new_notifs });
      setHasNewNotifs(has_new_notifs);
    }
  }, [user_notifications]);

  // --- DESKTOP HEADER ---
  const DesktopHeader = React.memo(() => (
    <header
      className={cn(
        "w-full border-b flex flex-col transition-colors duration-200 sticky top-0 z-50",
        !(pathname === "/" && isOnTopScrollOnHome)
          ? "bg-white border-b-slate-200"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="flex items-center justify-between px-6 py-3 w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center min-w-[130px] mr-auto">
          <Image src="/images/logo.svg" alt="Logo" width={130} height={30} />
        </Link>
        {/* Search bar */}
        <div className="flex-1 flex justify-center">
          {!(pathname === "/" && isOnTopScrollOnHome) && (
            <DateLocationFilter
              selectedDay={date_filter}
              handleLocationChange={(payload: any) =>
                setParams({ ...params, location: payload.city ?? "" })
              }
              handleDateChange={(date: any) =>
                setParams({ ...params, date: dayjs(date).format("YYYY-MM-DD") })
              }
              handleOnSearch={(e: any) => queryForEvents(e)}
              searchResults={search_results}
            />
          )}
        </div>
        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="navigation-link">
                  Actividades
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <div>
                <DropdownMenu
                  open={agendaMenuOpen}
                  onOpenChange={setAgendaMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className={cn(
                        "navigation-link",
                        agendaMenuOpen && "active-dropdown"
                      )}
                      onMouseEnter={() => {
                        setTimeout(() => {
                          setAgendaMenuOpen(true);
                        }, 250);
                      }}
                    >
                      Mi agenda
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-[200px] bg-white border border-slate-200 rounded-lg relative"
                  >
                    <div onMouseLeave={() => setAgendaMenuOpen(false)}>
                      {/* Arrow indicator */}
                      {agendaMenuOpen && (
                        <div className="absolute top-0 right-6 w-4 h-4 z-10 -translate-y-1/2 -translate-x-[16px]">
                          <div className="w-4 h-4 bg-white border-b border-r border-slate-200 rotate-[225deg] " />
                        </div>
                      )}
                      <DropdownMenuItem
                        asChild
                        className="py-2 hover:bg-slate-100 rounded-md"
                      >
                        <Link
                          href="/user/my-schedule/"
                          className="navigation-link dropdown-link"
                        >
                          <LuCalendarDays size={16} />
                          <span>Mi Calendario</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="py-2 hover:bg-slate-100 rounded-md"
                      >
                        <Link
                          href="/user/followed/"
                          className="navigation-link dropdown-link"
                        >
                          <LuUser size={16} />
                          <span>Perfiles seguidos</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </NavigationMenuItem>
            {user && user.is_business && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/user/my-events/" className="navigation-link">
                    Mis eventos
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {user && (
              <Button
                variant="clear"
                className="relative px-2"
                onClick={() => toggleNotificationsModal(true)}
              >
                <AiFillBell size={24} className="text-slate-900" />
                {has_new_notifs && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            )}
            {user && user.is_business && (
              <NavigationMenuItem>
                <Link
                  href="/activity/create/"
                  className="bg-red-500 hover:bg-red-400 text-white hover:text-white/[0.8] font-bold py-2 px-4 rounded-lg text-base transition-colors ml-2"
                >
                  Crear evento
                </Link>
              </NavigationMenuItem>
            )}
            {/* User avatar dropdown */}
            {user && (
              <NavigationMenuItem className="ml-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="overflow-hidden bg-none p-0 border-0 outline-0 rounded-full"
                    >
                      <Image
                        src={user.business_picture || user.image || ""}
                        className="w-8 h-8 min-w-8 min-h-8 object-cover rounded-full"
                        alt=""
                        width="32"
                        height="32"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[9] text-right !top-[4px]">
                    {!user.is_business && (
                      <DropdownMenuItem asChild>
                        <Button
                          onClick={() => push("/user/create-business-profile/")}
                          className="hover:bg-transparent w-full text-left"
                        >
                          <span className="bg-blue-500 hover:bg-blue-700 mt-0 inline-block px-2 py-2 text-white font-semibold rounded">
                            Actualizar a Negocio
                          </span>
                        </Button>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Button
                        className="py-2 w-full text-left"
                        onClick={() => push("/user/settings/")}
                      >
                        Configuracion
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button
                        className="py-2 w-full text-left"
                        onClick={() => signOut()}
                      >
                        Cerrar sesion
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            )}
            {!session && (
              <NavigationMenuItem>
                <Button
                  onClick={() => signIn()}
                  className="ml-2 whitespace-nowrap"
                >
                  Login
                </Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  ));

  // --- MOBILE HEADER ---
  const MobileHeader = () => (
    <header className="w-full border-b bg-white flex flex-col">
      <div className="flex items-center px-4 py-3 w-full">
        <button
          onClick={() => toggleMobileNav(true)}
          className="min-w-[32px] h-[32px] flex items-center justify-center"
        >
          <AiOutlineMenu size={24} />
        </button>
        <Link href="/" className="ml-2">
          <Image src="/images/logo-m.svg" alt="Logo" width={32} height={32} />
        </Link>
        <div className="flex-1 mx-2">
          <button
            onClick={() => toggleSearchMobile(true)}
            className="w-full border rounded px-2 py-1 text-slate-400 flex items-center bg-white"
          >
            <AiOutlineSearch size={20} />
            <span className="ml-2">¿Qué buscas hoy?</span>
          </button>
        </div>
        <button onClick={() => toggleNotificationsModal(true)} className="ml-2">
          <AiFillBell size={24} className="text-slate-900" />
          {has_new_notifs && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>
      {/* Category pills */}
      <CategoryPills />
      {/* Drawer for mobile menu */}
      <Drawer open={showMobileNav} onOpenChange={toggleMobileNav}>
        <DrawerContent className="fullscreen-dialog">
          <div className="px-5 py-8 h-full flex flex-col">
            {session && user ? (
              <span className="overflow-hidden p-1 outline-0 rounded-full flex items-center gap-3">
                <img
                  src={
                    user.business_picture
                      ? user.business_picture
                      : user.image ?? ""
                  }
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  alt=""
                />
                <h3 className="text-xl font-semibold mb-0">{user.name}</h3>
              </span>
            ) : (
              <Button
                role="link"
                variant="light"
                onClick={() => mobileButtonHandler("/")}
                className="mobile-link branding block bg-transparent"
              >
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  className="branding-logo"
                  width={100}
                  height={100}
                />
              </Button>
            )}
            <nav className="flex mt-8 gap-4 flex-col">
              <Button
                role="link"
                onClick={() => {
                  toggleMobileNav(false);
                  push("/");
                }}
                className="mobile-link nav-link px-0"
              >
                Actividades
              </Button>
              {user && (
                <>
                  <Button
                    role="link"
                    onClick={() => {
                      toggleMobileNav(false);
                      push("/user/my-schedule/");
                    }}
                    className="mobile-link nav-link px-0"
                  >
                    Mi calendario
                  </Button>
                  <Button
                    role="link"
                    onClick={() => {
                      toggleMobileNav(false);
                      push("/user/followed/");
                    }}
                    className="mobile-link nav-link px-0"
                  >
                    Perfiles seguidos
                  </Button>
                </>
              )}
              {user && user.is_business && (
                <Button
                  role="link"
                  onClick={() => {
                    toggleMobileNav(false);
                    push("/user/my-events/");
                  }}
                  className="mobile-link nav-link px-0"
                >
                  Mis eventos
                </Button>
              )}
              {user && user.is_business && (
                <Button
                  variant="default"
                  onClick={() => {
                    toggleMobileNav(false);
                    push("/activity/create/");
                  }}
                  className="py-3 flex px-6 min-w-[160px] bg-red-500 text-white font-bold text-lg rounded-lg justify-center"
                >
                  Crear evento
                </Button>
              )}
              {!user?.is_business && user && (
                <Button
                  role="link"
                  onClick={() => {
                    toggleMobileNav(false);
                    push("/user/create-business-profile/");
                  }}
                  className="btn-primary !hover:bg-[#2489FF] !border-[#096ADC] border-2 py-2 !bg-[#2489FF]"
                >
                  Actualiza a Perfil de Negocios
                </Button>
              )}
              {user && (
                <Button
                  role="link"
                  onClick={() => {
                    toggleMobileNav(false);
                    push("/user/settings/");
                  }}
                  className="py-3 w-full px-6 bg-slate-50 flex min-w-[160px] gap-2 justify-center"
                >
                  <AiOutlineSetting size={24} />
                  <span className="font-semibold">Configuracion</span>
                </Button>
              )}
            </nav>
            {!session && (
              <Button
                role="link"
                onClick={() => {
                  toggleMobileNav(false);
                  signIn();
                }}
                className="mobile-link mr-auto whitespace-nowrap w-full mt-8"
              >
                Login
              </Button>
            )}
            {session && user && (
              <Button
                variant="outline-secondary"
                className="bottom-8 py-3 right-0 left-0 mx-auto w-full mt-auto"
                onClick={() => {
                  toggleMobileNav(false);
                  signOut();
                }}
              >
                Cerrar sesion
              </Button>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/* Drawer for notifications */}
      <Drawer open={notifications_modal} direction="top">
        <DrawerContent className="p-0 fullscreen-dialog" id="notifications">
          <DrawerHeader className="bg-white border-slate-100 border-b">
            <div className="flex px-4 w-full gap-3">
              <button
                className="flex items-center justify-center h-8 w-8"
                onClick={closeNotificationsModal}
              >
                <AiOutlineArrowLeft size={24} className="text-slate-900" />
              </button>
              <h3 className="text-xl font-semibold mb-0">Notificaciones</h3>
            </div>
          </DrawerHeader>
          {user_notifications.length > 0 ? (
            user_notifications.map((n: UserNotificationType) => (
              <NotificationItem key={n.id} {...n} className="pl-4 px-5" />
            ))
          ) : (
            <div className="py-3 border-b border-slate-100 flex flex-col justify-center text-center h-[200px] w-full min-w-[352px]">
              <span className="text-lg text-slate-400">
                No tienes notificaciones.
              </span>
            </div>
          )}
        </DrawerContent>
      </Drawer>
      {/* Drawer for search */}
      <Drawer open={search_mobile} direction="bottom">
        <DrawerContent className="fullscreen-dialog">
          <DrawerHeader className="bg-white border-slate-100 border-b h-16">
            <div className="flex px-4 w-full gap-4">
              <button
                className="flex items-center justify-center"
                onClick={handleSearchClose}
              >
                Cerrar
              </button>
              <div className="flex flex-row gap-2 items-center border border-slate-200 rounded-lg py-1 px-2 w-full">
                <AiOutlineSearch size={24} className="text-slate-900" />
                <input
                  ref={searchInput}
                  type="text"
                  className="text-base text-slate-900 w-full border-0 focus:outline-none"
                  placeholder="Que buscas hoy?"
                  onChange={handleInputSearchChange}
                />
              </div>
            </div>
          </DrawerHeader>
          {search_results &&
            (search_results.length > 0 ? (
              search_results.map((event, index) => (
                <SearchResultItem
                  key={index}
                  {...event}
                  onClick={handleSearchClose}
                />
              ))
            ) : (
              <span className="p-4 py-8 block text-center text-slate-600 text-base font-semibold">
                No se encontraron resultados.
              </span>
            ))}
        </DrawerContent>
      </Drawer>
    </header>
  );

  // --- CATEGORY PILLS ---
  const CategoryPills = () => (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide bg-white border-b">
      {CATEGORY_PILLS.map((pill) => (
        <button
          key={pill.value}
          className={cn(
            "px-5 py-2 rounded-full font-semibold text-base whitespace-nowrap transition-colors",
            pill.value === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          )}
        >
          {pill.label}
        </button>
      ))}
      <span className="mx-2"> </span>
      {FEE_PILLS.map((pill) => (
        <button
          key={pill.value}
          className={cn(
            "px-5 py-2 rounded-full font-semibold text-base whitespace-nowrap transition-colors",
            pill.value === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          )}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );

  // --- RENDER ---
  return windowWidth >= resolution.lg ? <DesktopHeader /> : <MobileHeader />;
};

export { Header };
