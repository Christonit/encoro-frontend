import Head from "next/head";
import { useState } from "react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { MdLocationPin, MdFacebook } from "react-icons/md";
import { useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  AiOutlineClockCircle,
  AiOutlineWhatsApp,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import OrganizerEventCard from "@/components/cards/StandardEventCardAlternative";
import { useBackend, useWindow } from "@/hooks";
import { truncateText } from "@/lib/utils";
import { useEvents } from "@/context/events";
import { BusinessProfileType, eventI } from "@/interfaces";

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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await fetch(
    `${process.env.SERVER_ADDRESS}api/organizer/events/${params!.username}`
  );

  if (response.status === 404) {
    return {
      redirect: {
        destination: "/404/",
        statusCode: 301,
      },
    };
  }

  if (response.status === 500) {
    throw new Error("Internal server error");
  }

  const data = await response.json();
  const events: eventI[] = data.events;
  const business_profile: BusinessProfileType = data.business_profile;

  // [

  //   {
  //     "@type": "Event",
  //     name: "Clandestino Rave",
  //     startDate: "2024-06-01T04:00:00.000Z",
  //     url: "https://www.encoro.app/events/clandestino_rave",
  //     image:
  //       "https://encoro.app/cdn-cgi/image/quality=85,format=webp/4df1a207-d7e8-43d5-824c-83ad69ff6651-Clandestino%20Rave.jpeg?format=webp&width=800",
  //     location: {
  //       "@type": "Place",
  //       name: "Event Location Name",
  //       address: {
  //         "@type": "PostalAddress",
  //         streetAddress: "3 Calle Vicente Celestino Duarte",
  //         addressLocality: "Santo Domingo",
  //         addressRegion: "Santo Domingo de Guzman",
  //         postalCode: "10210",
  //         addressCountry: "Dominican Republic",
  //       },
  //     },
  //   }
  // ],

  const { whatsapp, ...social_networks } = business_profile.social_networks;
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: business_profile.business_name || "",
    alternateName: business_profile.username || "",
    url: "https://www.encoro.app/organizers/" + business_profile.username || "",
    image: `https://encoro.app/cdn-cgi/image/quality=85,format=webp/${
      business_profile.business_picture.split("aws.com/")[1]
    }?format=webp&width=400`,
    sameAs:
      social_networks && Object.keys(social_networks).length > 0
        ? Object.keys(
            social_networks as Record<string, string | undefined>
          ).map((key) => social_networks[key] || "")
        : "",
    description: business_profile.biography || "",
    organizes: [...events].splice(0, 3).map((event: eventI) => {
      return {
        "@type": "Event",
        name: event.title,
        startDate: event.date + "T" + event.time + ".000Z",
        url: `https://www.encoro.app/${event.category}/${event.id}`,
        image: `https://encoro.app/cdn-cgi/image/quality=85,format=webp/${
          event.media![0].split(`aws.com/`)[1]
        }?format=webp&width=400`,
      };
    }),
  };

  return { props: { events, business_profile, schemaMarkup } };
};

const OrganizerPage = ({
  events,
  business_profile,
  schemaMarkup,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    followEventsIds,
    followEvent,
    followedOrganizers,
    setFollowedOrganizers,
  } = useEvents();
  const { windowWidth, resolution } = useWindow();
  const [openMap, setOpenMap] = useState(false);
  const [userInfo, setUserInfo] = useState<userI>();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const { destroy, post } = useBackend();
  const unfollowProfile = async () => {
    const { status } = await destroy(`/api/organizer/follow/`, {
      data: {
        user: userInfo?.id,
        organizer: business_profile.id,
      },
    });
    if (status === 200) {
      setFollowedOrganizers(
        followedOrganizers.filter(
          (item: any) => item.id !== business_profile?.id
        )
      );
    }
  };

  const followProfile = async () => {
    console.log("followProfile", business_profile);
    if (!session || !session.user) return;

    const { status } = await post(`/api/organizer/follow/`, {
      user: userInfo?.id,
      organizer: business_profile.id,
    });

    if (status === 201) {
      setFollowedOrganizers([...followedOrganizers, business_profile]);
    }
  };

  const socialNetworkLinks = (
    <div className="flex flex-row gap-[12px] flex-wrap lg:ml-auto items-center order-3">
      {windowWidth > resolution.lg && (
        <button
          onClick={isFollowed ? unfollowProfile : followProfile}
          className="ml-auto mr-0 text-[14px] px-[12px] py-[4px] font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isFollowed ? "Dejar de seguir" : "Seguir perfil"}
        </button>
      )}

      <span className="text-slate-900 font-semibold lg:hidden">
        Redes sociales
      </span>
      {windowWidth > resolution.lg &&
        business_profile.social_networks?.whatsapp && (
          <button
            className="max-w-[140px] inline-flex items-center gap-[8px] bg-[#25d366] text-base  border-[#128c7e] hover:bg-[#128c7e] hover:border-[#075e54] text-[#fff] hover:text-[#dcf8c6] px-[12px] py-[4px] rounded-[8px] text-sm font-medium"
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=${business_profile.social_networks.whatsapp}&text=Hola! Encontre este evento en Encoro. ${window.location.hostname}${router.asPath}/`,
                "_blank"
              )
            }
          >
            <AiOutlineWhatsApp size={24} />
            Contactar
          </button>
        )}

      <a
        href={business_profile.social_networks?.instagram}
        className="social-media-link"
        target="_blank"
        rel="noreferrer noopener"
      >
        <AiFillInstagram />
      </a>

      <a
        href={business_profile.social_networks?.twitter}
        className="social-media-link"
        target="_blank"
        rel="noreferrer noopener"
      >
        <AiFillTwitterCircle />
      </a>

      <a
        href={business_profile.social_networks?.facebook}
        className="social-media-link"
        target="_blank"
        rel="noreferrer noopener"
      >
        <MdFacebook />
      </a>
      {windowWidth <= resolution.lg &&
        business_profile.social_networks?.whatsapp && (
          <button
            className="max-w-[140px] inline-flex items-center gap-[8px] bg-[#25d366] text-base  border-[#128c7e] hover:bg-[#128c7e] hover:border-[#075e54] text-[#fff] hover:text-[#dcf8c6] px-[12px] py-[4px] rounded-[8px] text-sm font-medium"
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=${business_profile.social_networks.whatsapp}&text=Hola! Encontre este evento en Encoro. ${window.location.hostname}${router.asPath}/`,
                "_blank"
              )
            }
          >
            <AiOutlineWhatsApp size={24} />
            Contactar
          </button>
        )}
    </div>
  );

  useEffect(() => {
    setIsFollowed(
      followedOrganizers
        .map((item: any) => item.id)
        .includes(business_profile?.id)
    );
  }, [followedOrganizers]);
  useEffect(() => {
    if (session?.user && session.user.name) {
      setUserInfo(session["user"]!);
    }
  }, [session]);

  return (
    <div>
      <Head>
        <title>{business_profile.business_name} | Organizador - Encoro</title>

        <meta
          property="og:title"
          content={`${business_profile.business_name} | Organizador - Encoro`}
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href={`https://encoro.app/organizer/${business_profile.username}/`}
        />

        <meta
          property="og:url"
          content={`https://encoro.app/organizer/${business_profile.username}/`}
        />
        <meta
          property="og:image"
          content={`https://encoro.app/cdn-cgi/image/quality=85,format=webp/${business_profile.business_picture}?format=webp&width=1200`}
        />

        <meta
          property="og:description"
          content={
            business_profile.biography !== ""
              ? business_profile.biography
              : `Descubre los eventos más emocionantes y tus próximas actividades. Únete a nuestra comunidad y mantente al día con lo último en entretenimiento, Cultura, deportes y más. ¡Explora ahora!"`
          }
        />
        <meta property="og:site_name" content="Encoro" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@encoro_app" />
        <meta
          name="twitter:title"
          content={`${business_profile.business_name} organiza actividades en Encoro`}
        />
        <meta
          name="twitter:description"
          content={
            business_profile.biography !== ""
              ? business_profile.biography
              : `Descubre los eventos más emocionantes y tus próximas actividades. Únete a nuestra comunidad y mantente al día con lo último en entretenimiento, Cultura, deportes y más. ¡Explora ahora!"`
          }
        />
        <meta
          name="twitter:image"
          content={`https://encoro.app/cdn-cgi/image/quality=85,format=webp/${business_profile.business_picture}?format=webp&width=1200`}
        />

        <meta
          name="description"
          content={
            business_profile.biography !== ""
              ? business_profile.biography +
                "Descubre que hacer hoy: los eventos más emocionantes y tus próximas actividades."
              : `Descubre los eventos más emocionantes y tus próximas actividades. Únete a nuestra comunidad y mantente al día con lo último en entretenimiento, Cultura, deportes y más. ¡Explora ahora!"`
          }
        />

        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-[16px] lg:py-[32px]">
          <div className="w-full" id="business-profile">
            <div className="flex lg:flex-row flex-col w-full items-start lg:gap-[32px] mb-[16px] md:mb-0">
              <div className="flex w-full lg:w-auto  gap-[16px] items-center">
                <span className="business-profile-picture h-[96px] min-w-[96px] max-w-[96px] lg:h-[266px] lg:max-w-[266px] lg:min-w-[266px] flex overflow-hidden rounded-[12px] border-solid border-slate-100 border">
                  <img
                    src={business_profile.business_picture}
                    alt=""
                    className="w-full object-cover object-center"
                  />
                </span>

                <div className="block lg:hidden">
                  <h1 className="text-xl mb-0 md:mb-[16px] font-semibold">
                    {business_profile.business_name}
                  </h1>
                  <h4 className="text-lg mb-0 md:mb-[16px] font-normal">
                    @{business_profile.username}
                  </h4>

                  {windowWidth <= resolution.lg && (
                    <button
                      onClick={isFollowed ? unfollowProfile : followProfile}
                      className="ml-auto mr-0 text-[14px] px-[8px] py-[4px] font-semibold mt-[4px] border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {isFollowed ? "Dejar de seguir" : "Seguir perfil"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col gap-[16px] lg:gap-[20px]">
                <div className="flex lg:items-center flex-col lg:flex-row gap-[12px]">
                  <div className="hidden lg:block">
                    <h1 className="text-3xl mb-0 font-semibold">
                      {business_profile.business_name}
                    </h1>
                    <h4 className="text-lg  mb-0 md:mb-[16px] font-normal">
                      @{business_profile.username}
                    </h4>
                  </div>

                  {windowWidth > resolution.lg && socialNetworkLinks}
                </div>

                {business_profile.biography && (
                  <p
                    className="text-slate-500 hidden md:flex leading-relaxed max-w-[700px] mb-0"
                    dangerouslySetInnerHTML={{
                      __html: business_profile.biography,
                    }}
                  ></p>
                )}

                <div className="flex  flex-col items-start gap-[12px]">
                  {business_profile.biography &&
                    windowWidth <= resolution.lg && (
                      <p
                        className="text-slate-500  leading-relaxed max-w-[700px] mb-0"
                        dangerouslySetInnerHTML={{
                          __html: business_profile.biography,
                        }}
                      ></p>
                    )}
                  {business_profile.schedule && business_profile.schedule && (
                    <>
                      <span className="flex lg:items-center text-slate-500">
                        <AiOutlineClockCircle className="mr-[12px]" size={20} />

                        <div className="flex w-full lg:w-auto flex-wrap">
                          {business_profile.schedule.map(
                            (schedule: any, i: number) => (
                              <>
                                <span key={i}>
                                  {schedule.start_day &&
                                    schedule.start_day.length > 0 &&
                                    schedule.start_day[0].toUpperCase()}
                                  {schedule.end_day &&
                                    schedule.end_day.length > 0 && (
                                      <>
                                        &nbsp;-&nbsp;
                                        {schedule.end_day[0].toUpperCase()}
                                      </>
                                    )}
                                  :{" "}
                                  {schedule.time && schedule.time.toLowerCase()}
                                </span>
                                {windowWidth > resolution.lg &&
                                  i + 1 < business_profile.schedule.length && (
                                    <> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</>
                                  )}
                              </>
                            )
                          )}
                        </div>
                      </span>
                    </>
                  )}
                </div>

                {business_profile.location && (
                  <div className="">
                    <span className="inline-flex flex-start lg:items-center max-w-[600px] text-slate-500">
                      <MdLocationPin className="mr-[12px]" size={20} />

                      <div className="flex w-full lg:w-auto flex-wrap lg:items-center gap-[12px]">
                        <span className="text-base">
                          {truncateText(business_profile.location, 52)}
                        </span>
                        <button
                          onClick={() => setOpenMap(!openMap)}
                          className="lg:ml-[12px] text-[14px] font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          {!openMap ? "Ver mapa" : "Cerrar mapa"}
                        </button>
                      </div>
                    </span>

                    <div
                      className={`w-full block overflow-hidden rounded-[12px] border-[1px] border-slate-200 mt-[16px] lg:mt-[32px] transition-all duration-300 ${
                        openMap ? "max-h-[320px]" : "max-h-0"
                      }`}
                    >
                      <div id="event-map">
                        <iframe
                          className="w-full"
                          height={320}
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${business_profile.location}`}
                          allowFullScreen={true}
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}

                {windowWidth <= resolution.lg && socialNetworkLinks}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-slate-100 pb-[56px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-[32px] lg:py-[56px]">
            <div className="w-full">
              <h2 className="font-semibold mb-[32px]">
                Próximos Eventos{" "}
                <span className="text-slate-500"> ({events.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[24px]">
                {events && events.length > 0
                  ? events.map((event: any, index: number) => {
                      const isFollowed = followEventsIds.includes(event.id);

                      return (
                        <OrganizerEventCard
                          key={index}
                          {...event}
                          isFollowed={isFollowed}
                          loggedUser={
                            session && session.user ? userInfo?.id : null
                          }
                          onFollowAction={() => {
                            if (session && userInfo)
                              followEvent(event.id, userInfo.id!);
                          }}
                          media={event.media[0]}
                        />
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrganizerPage;
