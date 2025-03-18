import Card from "react-bootstrap/Card";
import Link from "next/link";
import { MdLocationPin, MdFilterList } from "react-icons/md";
import Badge from "react-bootstrap/Badge";
import { useWindow } from "../../hooks";
import { followedProfileI } from "../../interfaces";
import { imageLinkParser } from "@/lib/utils";
import { CATEGORIES_DICT } from "@/libs/variables";
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

  const component = (category: string, key: number) => {
    return (
      <Badge
        key={key}
        bg="secondary"
        className={`event-badge font-normal ${category}-badge`}
      >
        {CATEGORIES_DICT[category]}
      </Badge>
    );
  };
  return (
    <Card className="card lg:grid grid-cols-2 p-[16px] lg:p-[20px]">
      <div className="flex lg:flex-row gap-[16px] lg:gap-[32px] mb-[16px] lg:mb-0">
        <Link href={`/organizer/${username}`} className="">
          <img
            className="w-[92px] h-[92px] lg:w-[144px] lg:h-[144px] object-cover border border-slate-100 rounded-[8px]"
            src={business_picture}
          />
        </Link>

        <div className="flex flex-col justify-center lg:justify-start gap-[0]">
          <Link
            className="text-lg no-underline hover:underline text-slate-900 hover:text-slate-600 font-semibold "
            href={`/organizer/${username}`}
          >
            {name}
          </Link>
          <span className="text-base text-slate-900  mb-[8px]">
            @{username}
          </span>

          <span className="hidden lg:flex items-center mb-[12px]">
            <MdLocationPin className="mr-[4px] text-slate-500" size={20} />

            <span className="text-slate-500">{location}</span>
          </span>

          <div className="hidden lg:flex gap-[8px] items-center">
            {categories && categories.length > 0 && categories.length > 2 ? (
              <>
                {categories
                  .slice(0, 2)
                  .map((category: string, key: number) =>
                    component(category, key)
                  )}
                <Badge
                  bg="light"
                  text="dark"
                  className="border border-slate-100 py-[8px]"
                >
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

      <div className="lg:hidden ">
        <span className="flex items-start mb-[16px]">
          <MdLocationPin className="mr-[4px] text-slate-500" size={20} />

          <span className="text-slate-500 leading-tight">
            Gran Teatro del Cibao, Avenida Coronel Juan María Lora.
          </span>
        </span>

        <div className="flex  flex-wrap gap-[8px] items-center">
          {categories && categories.length > 0 && categories.length > 2 ? (
            <>
              {categories
                .slice(0, 2)
                .map((category: string, key: number) =>
                  component(category, key)
                )}
              <Badge
                bg="light"
                text="dark"
                className="border border-slate-100 py-[8px]"
              >
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

      {windowWidth > resolution.lg && events && events!.length > 0 && (
        <div className="flex flex-row !gap-[20px] lg:justify-end">
          {events?.slice(0, 4).map((event: any) => {
            return (
              <Link
                key={event.id}
                href={`/${event.category}/${event.id}`}
                target="_blank"
                className="max-w-[144px]"
              >
                <img
                  className="w-[92px] h-[92px] lg:w-[144px] lg:h-[144px] object-cover rounded-[8px]"
                  src={imageLinkParser(event.media!)[0]}
                />
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default FollowedProfileCard;
