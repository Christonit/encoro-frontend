import { useRouter } from "next/router";
import { AiOutlineClockCircle, AiOutlineWhatsApp } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import ProfileSocialBtn from "../buttons/ProfileSocialLinkButton";
import NoProfilePicBusiness from "../ilustrations/NoProfilePic";
import dayjs from "dayjs";
import cx from "classnames";
import Link from "next/link";
import { useBackend } from "../../hooks";

dayjs.locale("es-do");

type BusinessProfile = {
  id?: string;
  contact_email: string;
  business_name?: string;
  username?: string;
  biography: string;
  schedule: {
    start_day: string;
    end_day: string;
    time: string;
    time_obj: string[];
  }[];
  social_networks: {
    website: string;
    facebook: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
    twitter: string;
    youtube: string;
  };
  business_picture: string | null;
  phone_number: string;
  is_logged: boolean;
  is_followed?: boolean;
  user_id?: string;
  handleFollow?: (statusCode: number) => void;
};

const BusinessProfileCard = ({
  id,
  business_picture,
  phone_number,
  schedule,
  social_networks,
  business_name,
  username,
  is_logged,
  user_id,
  is_followed,
  handleFollow,
}: BusinessProfile) => {
  const router = useRouter();
  const { destroy, post } = useBackend();
  const unfollowProfile = async () => {
    const { status } = await destroy(`/api/organizer/follow/`, {
      data: {
        user: user_id,
        organizer: id,
      },
    });
    if (status === 200) {
      if (handleFollow) handleFollow(status);
    }
  };

  const followProfile = async () => {
    if (!is_logged) return;
    const { data, status } = await post(`/api/organizer/follow/`, {
      user: user_id,
      organizer: id,
    });
    if (status === 201) {
      if (handleFollow) handleFollow(status);
    }
  };

  return (
    <div
      id="business-profile-card"
      className="flex md:flex-row flex-col items-start gap-[20px]"
    >
      {business_picture && username ? (
        <Link
          href={`/organizer/${username}/`}
          className="business-profile-card-picture"
        >
          <img src={business_picture} alt="" />
        </Link>
      ) : (
        <span className="business-profile-card-picture border-solid border-slate-100 border">
          <NoProfilePicBusiness />
        </span>
      )}
      <div className="flex flex-col gap-[12px] min-w-[320px]">
        <span className="inline-flex flex-start items-center font-semibold text-slate-900 no-underline">
          {business_name && username ? (
            <Link
              href={`/organizer/${username}/`}
              className="text-base no-underline hover:underline text-slate-900 hover:text-slate-600"
            >
              {business_name}
            </Link>
          ) : (
            <span className="text-base">Falta usuario</span>
          )}

          {business_name && username && is_logged && (
            <Button
              variant="outline-secondary"
              onClick={is_followed ? unfollowProfile : followProfile}
              className=" ml-auto size-[14px] px-[12px] py-[4px] font-semibold"
            >
              {is_followed ? "Dejar de seguir" : "Seguir"}
            </Button>
          )}
        </span>

        {schedule && schedule && (
          <div
            className={`flex ${
              schedule.length > 1 ? "items-start" : "items-center"
            } text-slate-600 justify-start`}
          >
            <AiOutlineClockCircle
              className={cx("mr-[12px]", {
                "mt-[4px]": schedule.length > 1,
              })}
            />

            <div className="flex flex-col gap-[12px] ">
              {schedule.map((schedule: any, i: number) => (
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
            </div>
          </div>
        )}

        <div className="flex gap-[12px]">
          {social_networks && social_networks.website && (
            <ProfileSocialBtn.Website link={social_networks.website} />
          )}
          {social_networks && social_networks.facebook && (
            <ProfileSocialBtn.FacebookLink link={social_networks.facebook} />
          )}

          {social_networks && social_networks.instagram && (
            <ProfileSocialBtn.InstagramLink link={social_networks.instagram} />
          )}
          {social_networks && social_networks.tiktok && (
            <ProfileSocialBtn.TikTokLink link={social_networks.tiktok} />
          )}
          {social_networks && social_networks.twitter && (
            <ProfileSocialBtn.TwitterLink link={social_networks.twitter} />
          )}

          {social_networks && social_networks.whatsapp && (
            <button
              className="max-w-[140px] inline-flex items-center gap-[8px] bg-[#25d366] text-base  border-[#128c7e] hover:bg-[#128c7e] hover:border-[#075e54] text-[#fff] hover:text-[#dcf8c6] px-[8px] py-[4px] rounded-[8px] text-sm font-medium"
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send?phone=${social_networks.whatsapp}&text=Hola! Encontre este evento en Encoro. ${window.location.hostname}${router.asPath}/`,
                  "_blank"
                )
              }
            >
              <AiOutlineWhatsApp size={20} />
              Contactar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileCard;
