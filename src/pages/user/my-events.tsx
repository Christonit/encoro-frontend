import { getSession } from "next-auth/react";
import Head from "next/head";
import { ReactNode, useState } from "react";
import { MdLocationPin, MdFacebook } from "react-icons/md";
import axios from "axios";
import { useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { statusMessageType } from "@/interfaces";
import {
  AiTwotonePhone,
  AiOutlineClockCircle,
  AiOutlineWhatsApp,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineDelete,
} from "react-icons/ai";
import AdminEventCard from "@/components/cards/AdminEventCard";
import StatusModal from "@/components/messages/StatusModal";
import ConfirmationModal from "@/components/messages/ConfirmationModal";
import { useBackend, useWindow } from "@/hooks";
import NoEventsProfileCard from "@/components/cards/NoEventsProfileCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type socialNetworksType = {
  website: string;
  facebook: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  youtube: string;
};

interface userI {
  name?: string | null | undefined;
  id?: string | null | undefined;
  email?: string | null | undefined;
  phone_number?: string | null | undefined;
  social_networks?: socialNetworksType | string | null | undefined;
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

const UserMyEvents = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const [openMap, setOpenMap] = useState(false);
  const [userInfo, setUserInfo] = useState<userI>();
  const [userEvents, setUserEvents] = useState<any>([]);
  const [analytics, setUserAnalytics] = useState<{
    followers: number;
    eventsFollowers: number;
    followedOrganizers: number;
  }>();
  const { patch, get, destroy } = useBackend();
  const [disabledEvents, setDisabledEvents] = useState<any>([]);
  const [pastEvents, setPastEvents] = useState<any>([]);
  const [activeKey, setActiveKey] = useState("upcoming-events");
  const [statusMessage, setStatusMessage] = useState<statusMessageType>({
    type: null,
    show: false,
    message: {
      title: "",
      body: "",
    },
  });
  const [showConfirmActionModal, toggleConfirmActionModal] = useState<{
    is_visible: boolean;
    type?: string;
    payload?: {
      id: string;
      user_id: string;
      is_active?: boolean;
    };
  }>({
    is_visible: false,
  });
  const { windowWidth, resolution } = useWindow();

  const tabLabels = [
    {
      key: "upcoming-events",
      text: windowWidth <= resolution.md ? "Proximos" : "Próximos Eventos",
    },
    {
      key: "past-events",
      text: windowWidth <= resolution.md ? "Pasados" : "Eventos pasados",
    },
    { key: "disabled-events", text: "Deshabilitados" },
  ];

  const renderConfirmationModal = () => {
    let icon: ReactNode = <></>;
    let title: string = "";
    let message: string = "";

    console.log("RENDER THING");

    switch (showConfirmActionModal.type) {
      case "hide":
        icon = <AiOutlineEyeInvisible size={76} />;
        title = "Ocultar evento";
        message =
          "Desabilitar visibilidad  temporalmente del evento. Esta accion solo oculta el evento del publico sin borrarlo.";
        break;
      case "show":
        icon = <AiOutlineEye size={76} />;
        title = "Mostrar evento";
        message = "Habilitar visibilidad  del evento al publico.";
        break;
      case "delete":
      default:
        title = "Borrar evento";
        message =
          "Eliminar permanentemente el evento. Esta accion es irreversible.";
        icon = <AiOutlineDelete size={76} />;
        break;
    }

    if (showConfirmActionModal.payload) {
      const { id, user_id, is_active } = showConfirmActionModal.payload;

      return (
        <ConfirmationModal
          ilustration={icon}
          title={title}
          message={message}
          show={showConfirmActionModal.is_visible}
          closeModal={() => toggleConfirmActionModal({ is_visible: false })}
          continueAction={() =>
            showConfirmActionModal.type === "delete"
              ? deleteEvent(id, user_id)
              : toggleEventVisibility(id, user_id, is_active!)
          }
        />
      );
    }
  };

  const getUserEvents = async (id: string) => {
    try {
      const { data } = await get(`/api/events/user/${id}`);

      console.log({ FETCH_POST: data });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const deleteEvent = async (id: string, user_id: string) => {
    const response = await destroy(`/api/events/${id}`, {
      data: { user: user_id },
    });

    if (response.status === 200) {
      console.log({ response });
      setStatusMessage({
        type: "success",
        show: true,
        message: {
          title: "Evento borrado",
          body: "Evento eliminado permanentemente de manera exitosa.",
        },
      });

      setUserEvents((events: any[]) =>
        events.filter((event: any) => event.id !== id)
      );
    }

    if (response.status === 500) {
      setStatusMessage({
        type: "error",
        show: true,
        message: {
          title: "Error borrando evento",
          body: "Hmm. Parece que tenemos un problema. Intenta de nuevo mas tarde.",
        },
      });
    }

    toggleConfirmActionModal({ is_visible: false });
  };

  const toggleEventVisibility = async (
    id: string,
    user_id: string,
    is_active: boolean
  ) => {
    const event = userEvents.find((event: any) => event.id === id);

    event.is_active = !is_active;

    const response = await patch(`/api/events/${event.id}/visibility`, {
      user: user_id,
    });

    if (response.status === 200) {
      setStatusMessage({
        type: "success",
        show: true,
        message: {
          title: "Visibilidad actualizada",
          body: "Evento actualizado de manera exitosa.",
        },
      });

      setUserEvents((events: any[]) =>
        events.map((event: any) => {
          if (event.id === id) event.is_active = !is_active;

          return event;
        })
      );
    }

    if (response.status === 500) {
      setStatusMessage({
        type: "error",
        show: true,
        message: {
          title: "Error actualizando evento",
          body: "Hmm. Parece que tenemos un problema. Intenta de nuevo mas tarde.",
        },
      });
    }

    toggleConfirmActionModal({ is_visible: false });
  };

  const truncateText = (string: string) => {
    if (string.length > 36) return string.slice(0, 36) + "...";
    return string;
  };

  useEffect(() => {
    if (session?.user && session.user.name) {
      setUserInfo(session["user"]!);
    }
  }, [session]);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      getUserEvents(userInfo?.id).then((data) => setUserEvents(data));

      get(`/api/analytics/${userInfo.id}`).then((res) => {
        if (res.status === 200) {
          setUserAnalytics(res.data);
        }
      });
    }
  }, [userInfo]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setActiveKey(hash.slice(1));
    }
  }, []);

  useEffect(() => {
    if (userEvents.length > 0) {
      const disableEvents = userEvents.filter((event: any) => !event.is_active);

      setDisabledEvents(disableEvents);

      const pastEvents = userEvents.filter(
        (event: any) =>
          event.is_active && dayjs(event.date).isBefore(dayjs(), "day")
      );
      setPastEvents(pastEvents);
    }
  }, [userEvents]);

  return (
    <div>
      {statusMessage.type && (
        <StatusModal
          title={statusMessage.message.title}
          message={statusMessage.message.body}
          type={statusMessage.type}
          show={statusMessage.show}
          closeModal={() => {
            setStatusMessage((status) => ({ ...status, show: false }));
          }}
        />
      )}

      {showConfirmActionModal.is_visible ? renderConfirmationModal() : null}

      <Head>
        <title>Ajustes de tu cuenta - Encoro</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      {userInfo && (
        <div className="mx-auto max-w-7xl px-4">
          <div className="py-8">
            <div className="w-full" id="business-profile">
              <div className="flex w-full gap-4 lg:gap-8 mb-4 md:mb-0">
                {userInfo.business_picture && (
                  <span className="business-profile-picture h-[124px] min-w-[124px] max-w-[124px] lg:h-[266px] lg:max-w-[266px] lg:min-w-[266px] flex overflow-hidden rounded-2xl border border-slate-100">
                    <img
                      src={userInfo.business_picture}
                      alt=""
                      className="w-full object-cover object-center"
                    />
                  </span>
                )}
                <div className="flex w-full flex-col gap-5">
                  <div className="flex lg:items-center flex-col lg:flex-row gap-3">
                    <h1 className="text-2xl lg:text-4xl mb-0 md:mb-4 font-semibold">
                      {userInfo.name}
                    </h1>

                    <Button
                      variant="outline"
                      onClick={() => router.push(`/user/settings`)}
                      className="mr-auto text-sm px-3 h-9 font-semibold"
                    >
                      Editar perfil
                    </Button>

                    <div className="flex flex-row gap-3">
                      {typeof userInfo.social_networks === "object" &&
                        userInfo.social_networks?.whatsapp && (
                          <a
                            href={userInfo.social_networks?.whatsapp}
                            className="social-media-link"
                            rel="noreferrer noopener"
                          >
                            <AiOutlineWhatsApp />
                          </a>
                        )}
                      {typeof userInfo.social_networks === "object" &&
                        userInfo.social_networks?.instagram && (
                          <a
                            href={userInfo.social_networks?.instagram}
                            className="social-media-link"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <AiFillInstagram />
                          </a>
                        )}
                      {typeof userInfo.social_networks === "object" &&
                        userInfo.social_networks?.twitter && (
                          <a
                            href={userInfo.social_networks?.twitter}
                            className="social-media-link"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <AiFillTwitterCircle />
                          </a>
                        )}
                      {typeof userInfo.social_networks === "object" &&
                        userInfo.social_networks?.facebook && (
                          <a
                            href={userInfo.social_networks?.facebook}
                            className="social-media-link"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <MdFacebook />
                          </a>
                        )}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-5">
                    {userInfo.location && (
                      <>
                        <span className="inline-flex flex-start items-center max-w-[600px] text-slate-500">
                          <MdLocationPin className="mr-3" size={20} />
                          <span className="text-base">
                            {truncateText(userInfo.location)}
                          </span>
                          <Button
                            variant="outline"
                            className="ml-3 text-sm font-semibold"
                            onClick={() => setOpenMap(!openMap)}
                          >
                            {!openMap ? "Ver mapa" : "Cerrar mapa"}
                          </Button>
                        </span>

                        <span className="h-4 w-px bg-slate-300" />
                      </>
                    )}

                    {userInfo.phone_number && (
                      <span className="flex flex-end max-w-[200px] items-center text-slate-500">
                        <AiTwotonePhone className="mr-[12px]" />
                        <span className="text-base">
                          {userInfo.phone_number}
                        </span>
                      </span>
                    )}

                    {userInfo.schedule && userInfo.schedule && (
                      <>
                        <span className="h-[16px] w-[1px] bg-slate-300" />
                        <span className="flex items-center text-slate-600">
                          <AiOutlineClockCircle className="mr-[12px]" />

                          {userInfo.schedule.map((schedule: any, i: number) => (
                            <span key={i}>
                              {schedule.start_day &&
                                schedule.start_day.length > 0 &&
                                schedule.start_day[0].toUpperCase()}{" "}
                              -{" "}
                              {schedule.end_day &&
                                schedule.end_day.length > 0 &&
                                schedule.end_day[0].toUpperCase()}
                              : {schedule.time && schedule.time.toLowerCase()}
                            </span>
                          ))}
                        </span>
                      </>
                    )}
                  </div>

                  <div
                    className={`w-full hidden md:block overflow-hidden rounded-xl border border-slate-200 transition-all duration-300 ${
                      openMap ? "max-h-[320px]" : "max-h-0"
                    }`}
                  >
                    <div id="event-map">
                      <iframe
                        className="w-full"
                        height={320}
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${userInfo.location}`}
                        allowFullScreen={true}
                      ></iframe>
                    </div>
                  </div>

                  <p
                    className="text-slate-500 hidden md:flex leading-relaxed mb-[32px] max-w-[700px]"
                    dangerouslySetInnerHTML={{ __html: userInfo.biography }}
                  ></p>

                  {analytics && windowWidth >= resolution.lg && (
                    <div className="flex w-full border-solid border-slate-100 border-t">
                      <span className="p-[12px] text-slate-600">
                        <b className="font-semibold mr-[4px]">
                          {analytics.followers}
                        </b>
                        seguidores
                      </span>
                      <span className="p-[12px] text-slate-600">
                        <b className="font-semibold mr-[4px]">
                          {analytics.eventsFollowers}
                        </b>
                        seguidores de eventos activos
                      </span>
                      <span className="p-[12px] text-slate-600">
                        <b className="font-semibold mr-[4px]">
                          {analytics.followedOrganizers}
                        </b>
                        perfiles seguidos
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="block lg:hidden">
                <div className="flex  flex-col items-start gap-[12px]">
                  {userInfo.phone_number && (
                    <span className="flex flex-end  items-center text-slate-500">
                      <AiTwotonePhone className="mr-[12px]" />
                      <span className="text-base">{userInfo.phone_number}</span>
                    </span>
                  )}

                  {userInfo.schedule && userInfo.schedule && (
                    <>
                      <span className="flex items-start text-slate-500 mb-[8px]">
                        <AiOutlineClockCircle className="mr-[12px]" />
                        <span className="flex flex-wrap flex-col gap-[4px] text-slate-500">
                          {userInfo.schedule.map((schedule: any, i: number) => (
                            <span key={i}>
                              {schedule.start_day &&
                                schedule.start_day.length > 0 &&
                                schedule.start_day[0].toUpperCase()}{" "}
                              -{" "}
                              {schedule.end_day &&
                                schedule.end_day.length > 0 &&
                                schedule.end_day[0].toUpperCase()}
                              : {schedule.time && schedule.time.toLowerCase()}
                            </span>
                          ))}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {userInfo.location && (
                  <>
                    <span className="inline-flex  flex-start items-start max-w-[600px] text-slate-500">
                      <MdLocationPin className="mr-[12px]" size={20} />
                      <span className="text-base">
                        {truncateText(userInfo.location)}
                        <Button
                          variant="outline"
                          className="text-sm font-semibold border-none px-0"
                          onClick={() => setOpenMap(!openMap)}
                        >
                          {!openMap ? "Ver mapa" : "Cerrar mapa"}
                        </Button>
                      </span>
                    </span>

                    <div
                      className={`w-full block overflow-hidden rounded-xl border border-slate-200 transition-all duration-300 ${
                        openMap ? "max-h-[320px]" : "max-h-0"
                      }`}
                    >
                      <div id="event-map">
                        <iframe
                          className="w-full"
                          height={320}
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${userInfo.location}`}
                          allowFullScreen={true}
                        ></iframe>
                      </div>
                    </div>
                  </>
                )}

                {userInfo.biography && (
                  <p
                    className="text-slate-500 block md:hidden leading-relaxed mb-8 max-w-[700px]"
                    dangerouslySetInnerHTML={{ __html: userInfo.biography }}
                  ></p>
                )}
              </div>
            </div>
          </div>

          <div className="max-md:py-0 md:pb-0">
            <div className="w-full">
              <Tabs
                defaultValue={activeKey || "upcoming-events"}
                value={activeKey}
                onValueChange={(value: string) => {
                  setActiveKey(value);
                  router.push(`#${value}`);
                }}
                className="w-full"
              >
                <TabsList className="flex w-full mt-0 md:mt-8 mb-0">
                  {tabLabels.map((tab: any, i: number) => (
                    <TabsTrigger
                      key={i}
                      value={tab.key}
                      className="w-[200px] text-slate-500 data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      {tab.text}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="upcoming-events" className="min-h-[600px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {userEvents && userEvents.length > 0
                      ? userEvents.map((event: any, index: number) =>
                          event.is_active &&
                          dayjs(event.date).isSameOrAfter(dayjs(), "day") ? (
                            <AdminEventCard
                              key={index}
                              {...event}
                              media={event.media[0]}
                              userId={(session?.user as userI).id}
                              toggleVisibilityAction={(id, user_id, is_active) =>
                                toggleConfirmActionModal(() => ({
                                  is_visible: true,
                                  type: is_active ? "hide" : "show",
                                  payload: {
                                    id,
                                    user_id,
                                    is_active,
                                  },
                                }))
                              }
                              deleteEventAction={(id, user_id) =>
                                toggleConfirmActionModal(() => ({
                                  is_visible: true,
                                  type: "delete",
                                  payload: {
                                    id,
                                    user_id,
                                  },
                                }))
                              }
                            />
                          ) : null
                        )
                      : null}
                  </div>
                </TabsContent>

                <TabsContent value="past-events" className="min-h-[600px]">
                  {pastEvents && pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {pastEvents.map((event: any, index: number) => (
                        <AdminEventCard
                          key={index}
                          {...event}
                          media={event.media[0]}
                          userId={(session?.user as userI).id}
                          toggleVisibilityAction={(id, user_id, is_active) =>
                            toggleConfirmActionModal(() => ({
                              is_visible: true,
                              type: is_active ? "hide" : "show",
                              payload: {
                                id,
                                user_id,
                                is_active,
                              },
                            }))
                          }
                          deleteEventAction={(id, user_id) =>
                            toggleConfirmActionModal(() => ({
                              is_visible: true,
                              type: "delete",
                              payload: {
                                id,
                                user_id,
                              },
                            }))
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <NoEventsProfileCard className="mt-8" />
                  )}
                </TabsContent>

                <TabsContent value="disabled-events" className="min-h-[600px]">
                  {disabledEvents && disabledEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {disabledEvents.map((event: any, index: number) => (
                        <AdminEventCard
                          key={index}
                          {...event}
                          media={event.media[0]}
                          userId={(session?.user as userI).id}
                          toggleVisibilityAction={(id, user_id, is_active) =>
                            toggleConfirmActionModal(() => ({
                              is_visible: true,
                              type: is_active ? "hide" : "show",
                              payload: {
                                id,
                                user_id,
                                is_active,
                              },
                            }))
                          }
                          deleteEventAction={(id, user_id) =>
                            toggleConfirmActionModal(() => ({
                              is_visible: true,
                              type: "delete",
                              payload: {
                                id,
                                user_id,
                              },
                            }))
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <NoEventsProfileCard className="mt-8" />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      <section className="bg-slate-100 pb-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="py-8 lg:py-14">
            {analytics && windowWidth < resolution.lg && (
              <div className="block border-y border-slate-100 py-3 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Tus estadísticas
                </h3>
                <div className="flex w-full flex-col">
                  <span className="py-2 px-1 text-slate-400">
                    <b className="font-semibold text-slate-900 inline-block mr-4">
                      {analytics.followers}
                    </b>
                    Seguidores
                  </span>
                  <span className="py-2 px-1 text-slate-400">
                    <b className="font-semibold text-slate-900 inline-block mr-4">
                      {analytics.eventsFollowers}
                    </b>
                    Seguidores de eventos activos
                  </span>
                  <span className="py-2 px-1 text-slate-400">
                    <b className="font-semibold text-slate-900 inline-block mr-4">
                      {analytics.followedOrganizers}
                    </b>
                    Perfiles seguidos
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserMyEvents;
