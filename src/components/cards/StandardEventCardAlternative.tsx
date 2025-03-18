import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
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
import { CATEGORIES_DICT } from "@/libs/variables";
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
    <Card key={index} className="standard-card-alt">
      <Card.Header className="h-[240px] flex xl:h-[200px] relative align-center w-100 overflow-hidden py-[12px] px-[16px]">
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
        <Badge bg="primary" className="max-h-[24px] relative z-3">
          {CATEGORIES_DICT[category]}
        </Badge>

        {loggedUser && (
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
      </Card.Header>

      <Card.Body className="flex flex-column">
        <Link
          className="text-slate-900 no-underline"
          href={`/${category.toLocaleLowerCase().split(" ").join("-")}/${id}`}
        >
          <Card.Title className="text-base">
            {truncateText(title, 90)}
          </Card.Title>
        </Link>
        <Card.Text className="flex items-center gap-[12px]">
          <span className="inline-flex flex-start items-center text-slate-600">
            <AiTwotoneCalendar className="mr-[4px]" size={16} />
            <span className="text-base capitalize">
              {dayjs(date).locale(es).format("MMM D, YYYY")}
            </span>
          </span>
          <span className="h-[12px] w-[1px] bg-slate-300" />
          <span className="inline-flex flex-start items-center text-slate-600">
            <AiOutlineClockCircle className="mr-[4px]" size={16} />
            <span className="text-base">
              {dayjs(timeString).format("h:mm A")}
            </span>
          </span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default OrganizerEventCard;
