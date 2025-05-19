"use client";

import { useState, useRef, useEffect } from "react";
import { AiTwotoneCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Lightbox from "@/components/Lightbox";
import { useBackend, useWindow } from "@/hooks";
import { userI } from "@/interfaces/index";
import { cn, truncateText, formatMoneyWithCommas } from "@/lib/utils";
import { ShareLinkButton } from "@/components/buttons/ShareLinkButton";
import SuperUserBusinessProfileCard from "@/components/cards/SuperUserBusinessProfileCard";
import BusinessProfileCard from "@/components/cards/BusinessProfileCard";
import { CATEGORIES_DICT } from "@/lib/variables";
import { useEvents } from "@/context/events";

dayjs.locale("es-do");

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

interface EventPageContentProps {
  event: any;
  schemaMarkup: any;
}

export default function EventPageContent({ event, schemaMarkup }: EventPageContentProps) {
  const [openMap, setOpenMap] = useState(false);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<any[]>([]);
  const [hashtags, setHashtags] = useState<string[]>();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [media, setMedia] = useState<string[]>();
  const [secondary_category, setSecondaryCategory] = useState<string[]>();
  const [suggestedPosts, setSuggestedPosts] = useState<any[]>();
  const { windowWidth, resolution } = useWindow();
  const { asPath } = useRouter();
  const [hostname, setHostname] = useState("");
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const followTooltipRef = useRef<HTMLButtonElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [user, setUser] = useState<userI>();
  const { followedOrganizers, setFollowedOrganizers } = useEvents();
  const { get, post } = useBackend();

  const SOCIAL_NETWORKS = [
    "instagram",
    "facebook",
    "twitter",
    "whatsapp",
    "share-link",
  ];

  const { business_profile } = event;

  const getSuggested = async (category: string) => {
    const { data } = await get(`api/events/suggestions?category=${category}`);
    if (data) return setSuggestedPosts(data);
  };

  const followEvent = async () => {
    if (!session || (session && !session.user)) return;

    const user: userI = session!.user!;

    const { status } = await post(`/api/follow-event`, {
      user: user.id,
      event: event.id,
    });

    if (status === 201) {
      setShowTooltip(true);
      await setTimeout(() => {
        setShowTooltip(false);
        setIsFollowed(true);
      }, 3000);
    }
  };

  useEffect(() => {
    if (event.hashtags) {
      const tags = isJsonString(event.hashtags)
        ? JSON.parse(event.hashtags)
        : event.hashtags;
      setHashtags(tags);
    }

    if (event.secondary_category) {
      setSecondaryCategory(JSON.parse(event.secondary_category));
    }
    if (event.media) {
      setMedia(
        isJsonString(event.media) ? JSON.parse(event.media) : event.media
      );
    }

    if (event.category) {
      getSuggested(event.category);
    }
  }, [event]);

  useEffect(() => {
    if (media?.length) {
      setLightboxImages(() =>
        media.map((url: string) => {
          const imgUrl = url;
          return {
            src: `https://encoro.app/cdn-cgi/image/quality=85,format=webp/${imgUrl}`,
            loading: "lazy",
          };
        })
      );
    }
  }, [media]);

  useEffect(() => {
    if (session && session.user) {
      setIsLoggedIn(true);
      setUser(session.user);
      const user: userI = session.user;

      get(`/api/followed-event/${event.id}?user=${user.id}`).then(
        (response) => {
          if (response.statusText === "OK" && response.data)
            setIsFollowed(response.data.is_followed);
        }
      );
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  return (
    <div>
      <script
        className="saswp-schema-markup-output"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />

      {isLightboxOpen && (
        <Lightbox
          isOpen={isLightboxOpen}
          imageIndex={lightboxImageIndex}
          images={lightboxImages}
          handleClose={() => setLightboxOpen(false)}
        />
      )}
      <div className="lg:py-8">
        <div className="container mx-auto px-4 xl:container">
          <div className="lg:flex lg:flex-row-reverse" id="event-post-body">
            <div className="lg:w-1/2">
              <section className="mb-6 lg:mb-0 grid-container">
                <div className="activity-grid-area">
                  {media && (
                    <>
                      {media.map((image: string, i) => {
                        const imgUrl = image;
                        return (
                          <div
                            onClick={() => {
                              setLightboxImageIndex(i);
                              setLightboxOpen(true);
                            }}
                            key={i}
                            className={cn("", {
                              "activity-grid":
                                media.length > 1 ||
                                windowWidth >= resolution.lg,
                            })}
                          >
                            <img
                              src={`https://encoro.app/cdn-cgi/image/quality=85,format=webp,width=800/${imgUrl}`}
                              alt={imgUrl}
                              width="646"
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </section>
            </div>

            <div className="lg:w-1/2">
              <div className="flex gap-3 mb-6">
                {event.entrance_format === "free" ? (
                  <Badge variant="default" className="font-semibold">
                    Gratis
                  </Badge>
                ) : (
                  <Badge variant="default" className="font-semibold">
                    {event.fee > 0 && `RD$ ${formatMoneyWithCommas(event.fee)}`}
                  </Badge>
                )}

                {event.category && (
                  <Badge
                    variant="secondary"
                    className={`font-normal ${event.category}-badge`}
                  >
                    {CATEGORIES_DICT[event.category]}
                  </Badge>
                )}
                {secondary_category && (
                  <>
                    {secondary_category.map((category, i) => (
                      <Badge
                        variant="secondary"
                        key={i}
                        className={`font-normal ${category}-badge`}
                      >
                        {category}
                      </Badge>
                    ))}
                  </>
                )}
              </div>

              <h1 className="text-3xl font-semibold mb-6">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <span className="inline-flex items-center text-slate-600">
                  <AiTwotoneCalendar className="mr-3" size={20} />
                  <span className="text-base capitalize">
                    {dayjs(event.date).locale(es).format("MMMM D, YYYY")}
                  </span>
                </span>

                <span className="h-4 w-px bg-slate-300" />
                {event.date && (
                  <span className="inline-flex items-center text-slate-600">
                    <AiOutlineClockCircle className="mr-3" size={20} />
                    <span className="text-base lowercase">
                      {event.date.includes("T")
                        ? dayjs(
                            event.date.split("T")[0] + "T" + event.time
                          ).format("h:mm A")
                        : event.time}
                    </span>
                  </span>
                )}

                {windowWidth >= resolution.xl && (
                  <>
                    {event.ticket_link && (
                      <Link
                        href={event.ticket_link}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-base transition-colors"
                      >
                         Más información
                      </Link>
                    )}
                    {isLoggedIn && !isFollowed && (
                      <Button
                        variant="secondary"
                        onClick={() => followEvent()}
                        ref={followTooltipRef}
                      >
                        Voy pa&#39;alla!
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <TooltipContent>
                                <div className="text-base text-left">
                                  Evento guardado
                                </div>
                              </TooltipContent>
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center flex-wrap mb-8 text-slate-600">
                <span className="inline-flex items-start max-w-[600px]">
                  <MdLocationPin className="mr-3" size={20} />
                  <span className="text-base">
                    {truncateText(event.direction, 56)}
                  </span>
                </span>

                <Button
                  variant="outline"
                  className="mt-3 md:mt-0 md:ml-3 text-sm font-semibold"
                  onClick={() => setOpenMap(!openMap)}
                >
                  {!openMap ? "Ver mapa" : "Cerrar mapa"}
                </Button>

                {openMap && (
                  <div className="w-full mt-6 overflow-hidden rounded-xl border border-slate-200">
                    <div id="event-map">
                      <iframe
                        className="w-full"
                        height={250}
                        frameBorder={0}
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&q=${event.direction}`}
                        allowFullScreen={true}
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              <p
                className="text-slate-600 leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: event.description }}
              ></p>

              {hashtags && (
                <div className="flex w-full gap-2 mb-8">
                  {hashtags.map((hashtag: string, i: number) => (
                    <span
                      className="text-slate-900 font-normal bg-slate-100 rounded-2xl px-3 py-1"
                      key={i}
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex ml-auto items-center border-y border-slate-100 py-5 gap-4 md:gap-2 mb-8">
                <span className="text-base font-semibold text-slate-900 mr-2">
                  Compartir
                </span>

                {SOCIAL_NETWORKS.map((sn, index) => (
                  <ShareLinkButton
                    key={index}
                    link={`${hostname}${asPath}/`}
                    social_network={sn}
                    hashtags={hashtags}
                  />
                ))}
              </div>
              {(business_profile && !business_profile.username) ||
              business_profile.role == "SUPERUSER" ? (
                <SuperUserBusinessProfileCard />
              ) : (
                <BusinessProfileCard
                  {...business_profile}
                  is_logged={isLoggedIn}
                  handleFollow={(status: number) => {
                    if (status === 201) {
                      setFollowedOrganizers([
                        ...followedOrganizers,
                        business_profile,
                      ]);
                    }

                    if (status === 200) {
                      setFollowedOrganizers(
                        followedOrganizers.filter(
                          (item: any) => item.id !== business_profile?.id
                        )
                      );
                    }
                  }}
                  is_followed={followedOrganizers
                    .map((item: any) => item.id)
                    .includes(business_profile?.id)}
                  user_id={user ? user.id : null}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {suggestedPosts?.length && (
        <div className="container mx-auto px-4 xl:container relative z-[9] bg-white">
          <div className="px-0">
            <div className="lg:py-8">
              <h2 className="text-xl font-semibold lg:text-2xl border-t pt-8 border-slate-200 mb-6 lg:mb-8 text-slate-900">
                Actividades sugeridas
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {suggestedPosts?.map((post, index) => {
                  return (
                    <Link
                      href={`/${post.category}/${post.id}`}
                      key={index}
                      className="recomended-event"
                      style={{
                        backgroundImage: Array.isArray(post.media)
                          ? `url(${post.media[0]})`
                          : `url(${JSON.parse(post.media)[0]})`,
                      }}
                    >
                      <div className="recomended-event-text px-5 py-5">
                        <h3 className="text-xl">{post.title}</h3>
                        <span className="inline-flex items-center mr-3">
                          <AiTwotoneCalendar className="mr-3" />
                          <span className="text-base capitalize">
                            {dayjs(post.date).locale(es).format("MMMM D, YYYY")}
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {windowWidth < resolution.lg && (
        <div className="follow-event-fab">
          {event.ticket_link && (
            <Link
              href={event.ticket_link}
              target="_blank"
              rel="noreferrer"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Más información
            </Link>
          )}
          {isLoggedIn && !isFollowed && (
            <Button
              variant="default"
              size="lg"
              onClick={followEvent}
              ref={followTooltipRef}
              className="text-xl py-2 px-5"
            >
              Voy pa&apos; alla!
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <TooltipContent>
                      <div className="text-base text-left">Evento guardado</div>
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 