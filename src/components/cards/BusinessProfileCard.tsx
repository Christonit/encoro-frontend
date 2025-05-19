import { useRouter } from "next/router";
import { AiOutlineClockCircle, AiOutlineWhatsApp } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import ProfileSocialBtn from "../buttons/ProfileSocialLinkButton";
import NoProfilePicBusiness from "@/components/ilustrations/NoProfilePic";
import dayjs from "dayjs";
import Link from "next/link";
import { useBackend } from "@/hooks";
import { cn } from "@/lib/utils";

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
      className="flex md:flex-row flex-col items-start gap-5"
    >
      {business_picture && username ? (
        <Link
          href={`/organizer/${username}/`}
          className="w-24 h-24 rounded-full overflow-hidden"
        >
          <img 
            src={business_picture} 
            alt={business_name || "Business profile"} 
            className="w-full h-full object-cover"
          />
        </Link>
      ) : (
        <span className="w-24 h-24 rounded-full border border-slate-100 flex items-center justify-center">
          <NoProfilePicBusiness />
        </span>
      )}
      <div className="flex flex-col gap-3 min-w-[320px]">
        <span className="inline-flex items-center justify-between w-full font-semibold text-slate-900">
          {business_name && username ? (
            <Link
              href={`/organizer/${username}/`}
              className="text-base hover:underline text-slate-900 hover:text-slate-600"
            >
              {business_name}
            </Link>
          ) : (
            <span className="text-base">Falta usuario</span>
          )}

          {business_name && username && is_logged && (
            <Button
              variant={is_followed ? "outline" : "secondary"}
              onClick={is_followed ? unfollowProfile : followProfile}
              className="text-sm px-3 py-1 h-auto"
            >
              {is_followed ? "Dejar de seguir" : "Seguir"}
            </Button>
          )}
        </span>

        {schedule && schedule.length > 0 && (
          <div
            className={cn("flex text-slate-600 justify-start", {
              "items-start": schedule.length > 1,
              "items-center": schedule.length === 1,
            })}
          >
            <AiOutlineClockCircle
              className={cn("mr-3", {
                "mt-1": schedule.length > 1,
              })}
            />

            <div className="flex flex-col gap-3">
              {schedule.map((schedule: any, i: number) => (
                <span key={i} className="text-sm">
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

        <div className="flex gap-3">
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
            <Button
              variant="default"
              className="bg-[#25d366] hover:bg-[#128c7e] text-white hover:text-[#dcf8c6] max-w-[140px] inline-flex items-center gap-2"
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send?phone=${social_networks.whatsapp}&text=Hola! Encontre este evento en Encoro. ${window.location.hostname}${router.asPath}/`,
                  "_blank"
                )
              }
            >
              <AiOutlineWhatsApp size={20} />
              Contactar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileCard;
