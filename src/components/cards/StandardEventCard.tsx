import { truncateText, imageLinkParser } from "@/lib/utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Link from "next/link";
import { useState } from "react";
import {
  AiOutlineClockCircle,
  AiFillHeart,
  AiTwotoneCalendar,
} from "react-icons/ai";

import { CATEGORIES_DICT } from "@/lib/variables";
import { EventStandardCardI } from "../../interfaces";
import es from "dayjs/locale/es-do";
import Image from "@/components/ui/image";
import ProgressiveBlurOverlay from "@/components/cards/ProgressiveBlurOverlay";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

dayjs.extend(customParseFormat);
dayjs.locale("es-do");

const StandardEventCard = ({
  title,
  category,
  direction,
  time,
  image,
  id,
  date,
  isFollowed,
  displayDate = false,
  displayTime = true,
  loggedUser,
  unfollowAction,
  onFollowAction,
}: EventStandardCardI) => {
  const [formattedDate] = useState<string>(
    dayjs(date).locale(es).format("MMMM D, YYYY")
  );
  const timeString = date?.split("T")[0] + "T" + time;

  let imageCheck = imageLinkParser(image) as unknown as string;
  imageCheck = Array.isArray(imageCheck) ? imageCheck[0] : imageCheck;

  const postImage = Array.isArray(image)
    ? `https://encoro.app/cdn-cgi/image/quality=80,format=webp/${
        Array.isArray(image) ? image[0] : image
      }?width=426&format=webp"`
    : `https://encoro.app/cdn-cgi/image/quality=80,format=webp/${
        Array.isArray(imageCheck) ? imageCheck[0] : imageCheck
      }?width=426&format=webp"`;

  return (
    <Link
      className={`card event-card standard-card relative overflow-hidden`}
      href={`/${category}/${id}`}
      target={"_blank"}
    >
      <Image
        src={postImage}
        alt={postImage}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      {/* Progressive Blur Overlay */}
      <ProgressiveBlurOverlay />

      <div className="px-[20px] py-[20px] event-card-text px-[20px] py-[20px] mt-auto relative z-[2]">
        <div className="flex gap-[20px] items-center mb-[12px] flex-wrap">
          <Badge className={`${category}-badge`}>
            {CATEGORIES_DICT[category]}
          </Badge>

          {/* {displayDate && (
            <span className="flex items-center text-white text-shadow-lv1 text-base ">
              <AiTwotoneCalendar className="mr-[4px]" size={16} />
              <span className="text-base capitalize">{formattedDate}</span>
            </span>
          )}

          {displayTime && (
            <span className="hidden md:flex items-center text-white text-shadow-lv1 text-base  lowercase">
              <AiOutlineClockCircle className="mr-[4px]" size={16} />
              {dayjs(timeString).format("h:mm A")}
            </span>
          )} */}
        </div>
        <h2 className="subtitle text-white   text-shadow-lv1 mb-[12px]">
          {truncateText(title, 64)}
        </h2>
        {direction && (
          <div className="flex gap-[16px] align-items-center">
            <span className="text-label  text-shadow-lv1 text-white text-shadow-lv1">
              {truncateText(direction, 68)}
            </span>
          </div>
        )}

        {unfollowAction && (
          <button
            className={`rounded-[8px] border   follow-btn-secondary relative  !min-h-auto hover:text-slate-500 z-[5]  !text-sm items-center  gap-[8px] mt-[12px] !min-h-[28px] !py-[0] px-[8px] !border-slate-100  w-auto flex text-slate-100 `}
            onClick={(e) => {
              unfollowAction();
              e.currentTarget.blur();
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <AiFillHeart size={14} />
            Dejar de seguir
          </button>
        )}
      </div>
      {loggedUser && !unfollowAction && (
        <Button
          className={`follow-btn ${isFollowed ? "followed" : ""}`}
          onClick={(e) => {
            onFollowAction?.();
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
};

export default StandardEventCard;
