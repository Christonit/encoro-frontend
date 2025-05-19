import React from "react";
import {
  AiFillTwitterCircle,
  AiOutlineWhatsApp,
  AiFillInstagram,
} from "react-icons/ai";
import { IoLogoTiktok } from "react-icons/io5";
import { MdFacebook, MdLanguage } from "react-icons/md";
import Link from "next/link";

type ShareLinkButtonType = {
  link: string;
  phone_number?: string;
};

const WhatsAppLink = (props: ShareLinkButtonType) => {
  if (!props.phone_number) return;

  const encodedMessage = encodeURIComponent(
    `Hola, escribo porque encontre este Evento en Encoro:\n${props.link}`
  );

  const whatsappUrl = `https://wa.me/${props.phone_number}?text=${encodedMessage}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      className="hover:text-slate-900 bg-transparent hover:bg-slate-100 py-[4px] text-slate-500 "
    >
      <AiOutlineWhatsApp size={24} />
    </Link>
  );
};

const InstagramLink = (props: ShareLinkButtonType) => {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="hover:text-slate-900 bg-transparent hover:bg-slate-100 py-[4px] text-slate-500 "
    >
      <AiFillInstagram size={24} />
    </Link>
  );
};

const TwitterLink = (props: ShareLinkButtonType) => {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="hover:text-slate-900 bg-transparent hover:bg-slate-100 py-[4px] text-slate-500 "
    >
      <AiFillTwitterCircle size={24} />
    </Link>
  );
};
const FacebookLink = (props: ShareLinkButtonType) => {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="hover:text-slate-900 bg-transparent hover:bg-slate-100 py-[4px] text-slate-500 "
    >
      <MdFacebook size={24} />
    </Link>
  );
};
const TikTokLink = (props: ShareLinkButtonType) => {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="hover:text-slate-900 bg-transparent hover:bg-slate-100 py-[4px] text-slate-500 "
    >
      <IoLogoTiktok size={24} />
    </Link>
  );
};
const Website = (props: ShareLinkButtonType) => {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="hover:text-slate-900 bg-transparent hover:bg-slate-100 py-[4px] text-slate-500 "
    >
      <MdLanguage size={24} />
    </Link>
  );
};

const ProfileSocial = () => {
  return <></>;
};

ProfileSocial.FacebookLink = FacebookLink;
ProfileSocial.TwitterLink = TwitterLink;
ProfileSocial.InstagramLink = InstagramLink;
ProfileSocial.WhatsAppLink = WhatsAppLink;
ProfileSocial.TikTokLink = TikTokLink;
ProfileSocial.Website = Website;

export default ProfileSocial;
