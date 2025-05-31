import Link from "next/link";
import { MdLocationPin } from "react-icons/md";
import { useWindow } from "../../hooks";
import { followedProfileI } from "../../interfaces";
import { imageLinkParser } from "@/lib/utils";
import { CATEGORIES_DICT } from "@/lib/variables";

const Badge = ({
  children,
  className = "",
  color = "bg-slate-200 text-slate-900",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) => (
  <span
    className={`inline-block px-3 py-1 rounded-2xl text-sm font-semibold ${color} ${className}`}
  >
    {children}
  </span>
);

const FollowedProfileCard = ({
  name,
  id,
  username,
  business_picture,
  location,
  events,
}: followedProfileI) => {
  const { windowWidth, resolution } = useWindow();

  let categories: string[] =
    events && events.length > 0
      ? Array.from(
          new Set(
            events
              .map((event) => event.category)
              .filter((value): value is string => value !== undefined)
          )
        )
      : [];

  const component = (category: string, key: number) => (
    <Badge
      key={key}
      className={`event-badge font-normal ${category}-badge`}
      color="bg-slate-200 text-slate-900"
    >
      {CATEGORIES_DICT[category]}
    </Badge>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border card lg:grid grid-cols-2 p-4 lg:p-5">
      <div className="flex lg:flex-row gap-4 lg:gap-8 mb-4 lg:mb-0">
        <Link href={`/organizer/${username}`} className="">
          <img
            className="w-[92px] h-[92px] lg:w-[144px] lg:h-[144px] object-cover border border-slate-100 rounded-[8px]"
            src={business_picture}
            alt={name}
          />
        </Link>

        <div className="flex flex-col justify-center lg:justify-start gap-0">
          <Link
            className="text-lg no-underline hover:underline text-slate-900 hover:text-slate-600 font-semibold"
            href={`/organizer/${username}`}
          >
            {name}
          </Link>
          <span className="text-base text-slate-900 mb-2">@{username}</span>

          <span className="hidden lg:flex items-center mb-3">
            <MdLocationPin className="mr-1 text-slate-500" size={20} />
            <span className="text-slate-500">{location}</span>
          </span>

          <div className="hidden lg:flex gap-2 items-center flex-wrap">
            {categories && categories.length > 0 && categories.length > 2 ? (
              <>
                {categories
                  .slice(0, 2)
                  .map((category: string, key: number) =>
                    component(category, key)
                  )}
                <Badge className="border border-slate-100 py-2" color="bg-slate-100 text-slate-900">
                  {categories.length - 2} categorias +
                </Badge>
              </>
            ) : (
              categories.map((category: string, key: number) =>
                component(category, key)
              )
            )}

            <span className="text-base text-slate-500">
              {events?.length} actividades proximas
            </span>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <span className="flex items-start mb-4">
          <MdLocationPin className="mr-1 text-slate-500" size={20} />
          <span className="text-slate-500 leading-tight">{location}</span>
        </span>

        <div className="flex flex-wrap gap-2 items-center">
          {categories && categories.length > 0 && categories.length > 2 ? (
            <>
              {categories
                .slice(0, 2)
                .map((category: string, key: number) =>
                  component(category, key)
                )}
              <Badge className="border border-slate-100 py-2" color="bg-slate-100 text-slate-900">
                {categories.length - 2} categorias +
              </Badge>
            </>
          ) : (
            categories.map((category: string, key: number) =>
              component(category, key)
            )
          )}

          <span className="text-base text-slate-500">
            {events?.length} actividades proximas
          </span>
        </div>
      </div>

      {windowWidth > resolution.lg && events && events.length > 0 && (
        <div className="flex flex-row gap-5 lg:justify-end">
          {events.slice(0, 4).map((event: any) => (
            <Link
              key={event.id}
              href={`/${event.category}/${event.id}`}
              target="_blank"
              className="max-w-[144px]"
            >
              <img
                className="w-[92px] h-[92px] lg:w-[144px] lg:h-[144px] object-cover rounded-[8px]"
                src={imageLinkParser(event.media!)[0]}
                alt={event.title}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowedProfileCard;
