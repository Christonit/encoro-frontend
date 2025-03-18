import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import OnHoverDropdown from "./cards/OnHoverDropdown";
import logo from "../../public/logo.svg";
import logoM from "../../public/images/logo-m.svg";
import Image from "next/image";
import {
  AiOutlineMenu,
  AiOutlineSetting,
  AiFillBell,
  AiOutlineArrowLeft,
  AiOutlineSearch,
} from "react-icons/ai";

import Link from "next/link";
import DateLocationFilter from "./DateAndLocationDesktop";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useEvents } from "../context/events";
import {
  UserNotificationType,
  userI,
  EventSearchResultType,
} from "../../src/interfaces";
import dayjs from "dayjs";
import { useBackend, useWindow } from "../hooks";
import cx from "classnames";
import NotificationItem from "./notifications/NotificationItem";
import SearchResultItem from "./SearchResultItem";

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
    if (pathname === "/" && shouldActionsBar && scrollPos >= 400) {
      setIsOnTopScrollOnHome(false);
    } else if (pathname === "/" && shouldActionsBar && scrollPos < 400) {
      setIsOnTopScrollOnHome(true);
    }
  }, [shouldActionsBar, pathname, scrollPos]);

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

  return (
    <header
      className={cx("top-bar", {
        "is-scrolling": scrollDirectionValue === "down",
        "bg-white border-b border-slate-100":
          scrollPos >= 10 || !isOnTopScrollOnHome,
      })}
    >
      <button
        className="min-w-[32px] h-[32px] flex xl:hidden items-center justify-center   left-[16px] top-[16px] md:relative  md:top-0 md:left-0  md:ml-0"
        onClick={() => toggleMobileNav(!showMobileNav)}
      >
        <AiOutlineMenu size={24} />
      </button>

      <Link
        href="/"
        className="branding hidden mx-auto md:ml-0 md:mr-0 lg:block"
      >
        <Image src={logo} alt="Logo" className="branding-logo" />
      </Link>

      <Link href="/" className="lg:hidden">
        <Image
          src={logoM}
          alt="Logo"
          className="branding-logo min-w-[32px] h-[32px] object-fit"
        />
      </Link>

      <div className="w-full block lg:hidden">
        {(!isOnTopScrollOnHome || pathname !== "/") && (
          <button
            className="border-slate-200 border-[1px] lg:hidden  w-full rounded-[8px] text-slate-400  h-[32px] flex items-center text-base px-[8px] gap-[4px] leading-none"
            onClick={() => toggleSearchMobile(!search_mobile)}
          >
            <AiOutlineSearch size={20} className="text-slate-900" />
            <span>¿Qué buscas hoy?</span>
          </button>
        )}
      </div>

      {windowWidth >= resolution.md ? (
        <div className="nav-container">
          {shouldActionsBar && !isOnTopScrollOnHome ? (
            <DateLocationFilter
              ref={homeActions}
              selectedDay={date_filter}
              handleLocationChange={(payload: any) =>
                setParams({
                  ...params,
                  location: payload.city ?? "",
                })
              }
              handleDateChange={(date: any) => {
                setParams({
                  ...params,
                  date: dayjs(date).format("YYYY-MM-DD"),
                });
              }}
              handleOnSearch={(e: any) => {
                queryForEvents(e);
              }}
              searchResults={search_results}
            />
          ) : null}

          {windowWidth >= resolution.xl && (
            <div className="top-bar-aside">
              <NavigationMenu>
                <NavigationMenuList className="nav-links">
                  <NavigationMenuItem>
                    <Link href="/" className="nav-link">
                      Actividades
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Nav>
                <Link href="/" className="nav-link">
                  Actividades
                </Link>
                {session && user && (
                  <div
                    ref={customDropdown}
                    className="has-dropdown"
                    onClick={async (e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      customDropdown.current!.style.pointerEvents = "none";
                      await setTimeout(() => {
                        customDropdown.current!.style.pointerEvents = "auto";
                      }, 100);
                    }}
                  >
                    <span className="nav-link">Mi agenda</span>

                    <div className="dropdown-box">
                      <Link
                        href="/user/my-schedule/"
                        className="nav-link !pl-[20px]"
                      >
                        Mi Calendario
                      </Link>
                      <Link
                        href="/user/followed/"
                        className="nav-link !pl-[20px]"
                      >
                        Perfiles seguidos
                      </Link>
                    </div>
                  </div>
                )}
                {session && user && user.is_business && (
                  <Link href="/user/my-events/" className="nav-link">
                    Mis eventos
                  </Link>
                )}
              </Nav>

              {session && user && (
                <>
                  <OnHoverDropdown
                    onMouseLeave={updateNotifications}
                    parent={
                      <button
                        className={cx(
                          "ml-[-8px] w-[36px] h-[36px] relative flex align-items-center rounded-full notification-btn",
                          {
                            "new-notifications": has_new_notifs,
                          }
                        )}
                      >
                        <AiFillBell className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] mx-auto" />
                      </button>
                    }
                  >
                    {user_notifications.length > 0 ? (
                      user_notifications.map((n: UserNotificationType) => (
                        <NotificationItem key={n.id} {...n} />
                      ))
                    ) : (
                      <div className="py-[12px] border-b border-slate-200 flex flex-col w-full min-w-[352px]">
                        <span className="text-base text-slate-600">
                          No tienes notificaciones.
                        </span>
                      </div>
                    )}
                  </OnHoverDropdown>

                  {user.is_business ? (
                    <Link
                      href="/activity/create/"
                      className="ml-auto whitespace-nowrap no-underline leading-none items-center flex bg-red-500 font-semibold text-white  h-[36px] px-[12px] rounded-[4px]"
                    >
                      Crear evento
                    </Link>
                  ) : null}

                  <Dropdown className="border-0 outline-0">
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="overflow-hidden  bg-none p-0 border-0 outline-0 rounded-[32px] "
                    >
                      <img
                        src={
                          user?.business_picture
                            ? user?.business_picture
                            : user!.image ?? ""
                        }
                        className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] object-cover rounded-full"
                        alt=""
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="z-[9] text-right !top-[4px]">
                      {!user.is_business && (
                        <Dropdown.Item
                          as="button"
                          onClick={() => push("/user/create-business-profile/")}
                          className=" hover:bg-transparent"
                        >
                          <span className="bg-blue-500 hover:bg-blue-700 mt-[0px] inline-block px-[8px] py-[8px] text-white font-semibold rounded-[4px]">
                            Actualizar a Negocio
                          </span>
                        </Dropdown.Item>
                      )}

                      <Dropdown.Item
                        className="py-[8px]"
                        as="button"
                        onClick={() => push("/user/settings/")}
                      >
                        Configuracion
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="py-[8px]"
                        as="button"
                        onClick={() => signOut()}
                      >
                        Cerrar sesion
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
              {!session && (
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                  className="ml-auto whitespace-nowrap"
                >
                  Login
                </Button>
              )}
            </div>
          )}
        </div>
      ) : session ? (
        <button
          onClick={() => toggleNotificationsModal(true)}
          className={cx(
            " w-[32px] h-[32px] ml-auto  lg:right-0 relative xl:hidden flex align-items-center justify-center notification-btn",
            {
              "new-notifications": has_new_notifs,
            }
          )}
        >
          <AiFillBell className="w-[24px] h-[24px] " />
        </button>
      ) : (
        <Button
          variant="primary"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
          className="ml-auto whitespace-nowrap px-[8px]"
        >
          Login
        </Button>
      )}

      {/* <Offcanvas
        show={notifications_modal}
        placement="end"
        name="notifications"
        className="fullscreen-dialog"
      >
        <Offcanvas.Header className="bg-white border-slate-100 border-b">
          <div className="flex px-[16px] w-full gap-[12px]">
            <button
              className="flex items-center justify-center h-[32px] w-[32px]"
              onClick={() => closeNotificationsModal()}
            >
              <AiOutlineArrowLeft size={24} className="text-slate-900" />
            </button>
            <h3 className="text-xl font-semibold mb-0">Notificaciones</h3>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          {user_notifications.length > 0 ? (
            user_notifications.map((n: UserNotificationType) => (
              <NotificationItem
                key={n.id}
                {...n}
                className="pl-[16px] px-[20px]"
              />
            ))
          ) : (
            <div className="py-[12px] border-b border-slate-100 flex flex-col justify-center text-center  h-[200px] w-full min-w-[352px]">
              <span className="text-lg text-slate-400">
                No tienes notificaciones.
              </span>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas
        show={search_mobile}
        placement="bottom"
        name="search-box"
        className="fullscreen-dialog"
      >
        <Offcanvas.Header className="bg-white border-slate-100 border-b h-[64px]">
          <div className="flex px-[16px] w-full gap-[16px]">
            <button
              className="flex items-center justify-center "
              onClick={() => handleSearchClose()}
            >
              Cerrar
            </button>

            <div className="flex flex-row gap-[8px] items-center border border-slate-200 rounded-[8px] py-[4px] px-[8px]">
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
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          {search_results &&
            (search_results.length > 0 ? (
              search_results.map((event, index) => (
                <SearchResultItem
                  key={index}
                  {...event}
                  onClick={() => handleSearchClose()}
                />
              ))
            ) : (
              <span className="p-[16px]  py-[32px] block text-center text-slate-600 text-base font-semibold text-center">
                No se encontraron resultados.
              </span>
            ))}
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showMobileNav} onHide={toggleMobileNav}>
        <div className="px-[20px] py-[32px] h-full relative flex flex-col">
          {session && user ? (
            <span className="overflow-hidden    p-[4px] outline-0 rounded-[32px] flex items-center gap-[12px]">
              <img
                src={
                  user?.business_picture
                    ? user?.business_picture
                    : user!.image ?? ""
                }
                className="w-[40px] h-[40px] rounded-[40px] object-cover border border-slate-100"
                alt=""
              />

              <h3 className="text-xl font-semibold mb-0">{user.name}</h3>
            </span>
          ) : (
            <Button
              role="link"
              variant="light"
              onClick={() => mobileButtonHandler("/")}
              className="mobile-link branding  block bg-transparent"
            >
              <Image src={logo} alt="Logo" className="branding-logo" />
            </Button>
          )}

          <Nav className="flex mt-[32px]  gap-[16px] flex-column">
            <Button
              role="link"
              variant=""
              onClick={() => mobileButtonHandler("/")}
              className="mobile-link nav-link px-0"
            >
              Actividades
            </Button>

            {user && (
              <>
                <Button
                  role="link"
                  variant=""
                  onClick={() => mobileButtonHandler("/user/my-schedule/")}
                  className="mobile-link nav-link px-0"
                >
                  Mi calendario
                </Button>
                <Button
                  role="link"
                  variant=""
                  onClick={() => mobileButtonHandler("/user/followed/")}
                  className="mobile-link nav-link px-0"
                >
                  Perfiles seguidos
                </Button>
              </>
            )}

            {user &&
              (user.is_business ? (
                <>
                  <Button
                    role="link"
                    variant=""
                    onClick={() => mobileButtonHandler("/user/my-events/")}
                    className="mobile-link nav-link px-0"
                  >
                    Mis eventos
                  </Button>
                </>
              ) : (
                <Button
                  role="link"
                  variant=""
                  onClick={() =>
                    mobileButtonHandler("/user/create-business-profile/")
                  }
                  className="  btn-primary !hover:bg-[#2489FF] !border-[#096ADC] border-[2px] py-[2px] !bg-[#2489FF]"
                >
                  Actualiza a Perfil de Negocios
                </Button>
              ))}

            {user && user.is_business && windowWidth < resolution.xl && (
              <Button
                role=""
                variant="outline-secondary"
                onClick={() => mobileButtonHandler("/activity/create/")}
                className="py-[8px] flex  px-[12px] min-w-[160px] bg-slate-50 text-center justify-center"
              >
                Publicar evento
              </Button>
            )}
            {session && user && (
              <>
                <Button
                  role="link"
                  variant=""
                  onClick={() => mobileButtonHandler("/user/settings/")}
                  className="py-[8px] w-full  px-[12px] bg-slate-50 flex min-w-[160px] gap-[8px] justify-center"
                >
                  <AiOutlineSetting size={24} />

                  <span className="font-semibold ">Configuracion</span>
                </Button>
              </>
            )}
          </Nav>

          {!session && (
            <Button
              role="link"
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
              className="mobile-link mr-auto whitespace-nowrap w-full mt-[32px]"
            >
              Login
            </Button>
          )}
          {session && user && (
            <Button
              variant="outline-secondary"
              className=" bottom-[32px] py-[12px] right-0 left-0 mx-auto w-full mt-auto"
              onClick={() => signOut()}
            >
              Cerrar sesion
            </Button>
          )}
        </div>
      </Offcanvas> */}
    </header>
  );
};

export { Header };
