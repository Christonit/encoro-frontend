import { useRouter } from "next/router";
import {
  AiTwotoneCalendar,
  AiOutlineClockCircle,
  AiFillHeart,
} from "react-icons/ai";
import { truncateText } from "@/lib/utils";
import dayjs from "dayjs";
import es from "dayjs/locale/es-do";
import Link from "next/link";
import { CATEGORIES_DICT } from "@/lib/variables";
dayjs.locale("es-do");

type AdminEventCardI = {
  index: number;
  id: string;
  media: string;
  category: string;
  userId: string;
  loggedUser: boolean;
  title: string;
  date: string;
  time: string;
  isFollowed?: boolean;
  toggleVisibilityAction?: (
    id: string,
    user_id: string,
    is_active: boolean
  ) => void;
  deleteEventAction?: (id: string, user_id: string) => void;
  onFollowAction?: () => void;
};

const Badge = ({
  children,
  className = "",
  color = "bg-slate-900 text-white",
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

const OrganizerEventCard = ({
  index,
  id,
  media,
  category,
  title,
  date,
  time,
  onFollowAction,
  loggedUser,
  isFollowed,
}: AdminEventCardI) => {
  const router = useRouter();

  const timeString = date?.split("T")[0] + "T" + time;

  return (
    <div key={index} className="bg-white rounded-lg shadow-sm border standard-card-alt">
      <div className="h-[240px] flex xl:h-[200px] relative align-center w-full overflow-hidden py-3 px-4">
        <img
          src={`https://encoro.app/cdn-cgi/image/quality=85,format=webp/${
            media.split("aws.com/")[1]
          }?width=360&format=webp`}
          className="w-full h-full object-cover absolute top-0 left-0 z-1"
          alt={`${title} event image`}
          loading="lazy"
          width={262}
          height={240}
        />
        <Badge className="max-h-[24px] relative z-3">
          {CATEGORIES_DICT[category]}
        </Badge>

        {loggedUser && (
          <button
            className={`absolute right-4 top-4 rounded-full p-1 transition-colors ${
              isFollowed ? "text-red-500" : "text-slate-400"
            }`}
            onClick={(e) => {
              onFollowAction?.();
              e.currentTarget.blur();
              e.stopPropagation();
              e.preventDefault();
            }}
            aria-label={isFollowed ? "Dejar de seguir" : "Seguir"}
          >
            <AiFillHeart size={36} />
          </button>
        )}
      </div>

      <div className="flex flex-col p-4">
        <Link
          className="text-slate-900 no-underline"
          href={`/${category.toLocaleLowerCase().split(" ").join("-")}/${id}`}
        >
          <div className="text-base font-semibold">
            {truncateText(title, 90)}
          </div>
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <span className="inline-flex items-center text-slate-600">
            <AiTwotoneCalendar className="mr-1" size={16} />
            <span className="text-base capitalize">
              {dayjs(date).locale(es).format("MMM D, YYYY")}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-300" />
          <span className="inline-flex items-center text-slate-600">
            <AiOutlineClockCircle className="mr-1" size={16} />
            <span className="text-base">
              {dayjs(timeString).format("h:mm A")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
