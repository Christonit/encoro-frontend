import { UserNotificationType } from "@/interfaces";
import { NOTIFICATION_TYPES, elapsedTimeFrom, truncateText } from "@/lib/utils";
import Link from "next/link";

type UserNotificationTypeExtended = UserNotificationType & {
  className?: string;
};
export default function NotificationItem({
  type,
  organizer,
  seen,
  event,
  created_at,
  className,
}: UserNotificationTypeExtended) {
  const Wrapper = ({
    children,
  }: {
    children: React.ReactNode | React.ReactNode[];
  }) => {
    return (
      <div
        className={
          "py-[12px] border-b border-slate-100 flex flex-col w-full min-w-[352px] relative" +
          (className ? " " + className : "")
        }
      >
        {children}
        <span className="text-slate-400 text-xs mt-[4px]">
          Hace {elapsedTimeFrom(created_at)}
        </span>
        {!seen && (
          <img
            src="/images/new-anim.webp"
            alt="new notification"
            className="absolute top-[12px] lg:top-[8px] right-[16px] lg:right-[8px] w-[32px]"
          />
        )}
      </div>
    );
  };

  switch (type) {
    case NOTIFICATION_TYPES.NEW_EVENTS:
      return (
        <Wrapper>
          <span className="text-sm text-slate-600">
            <Link
              className="no-underline text-slate-900 font-semibold hover:text-slate-700 hover:underline"
              href={`/organizer/${organizer.username}/`}
            >
              {organizer.name}
            </Link>{" "}
            &nbsp; ha publicado un evento nuevo: <br />
            {event && (
              <Link
                href={`/${event.category}/${event.id}/`}
                target="_blank"
                className="no-underline text-slate-900 font-semibold hover:text-slate-700 hover:underline"
              >
                {event.title}
              </Link>
            )}
          </span>
        </Wrapper>
      );
      break;
    case NOTIFICATION_TYPES.UPDATED_EVENT:
    default:
      return (
        <Wrapper>
          <span className="text-sm text-slate-600">
            <Link
              className="no-underline text-slate-900 font-semibold hover:text-slate-700 hover:underline"
              href={`/organizer/${organizer.username}/`}
            >
              {organizer.name}
            </Link>{" "}
            ha actualizado un evento que sigues:
            <br />
            {event && (
              <Link
                href={`/${event.category}/${event.id}/`}
                target="_blank"
                className="no-underline text-slate-900 font-semibold hover:text-slate-700 hover:underline"
              >
                {truncateText(event.title, 70)}
              </Link>
            )}
          </span>
        </Wrapper>
      );
  }
}
