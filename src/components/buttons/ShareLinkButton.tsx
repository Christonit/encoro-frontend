import React from "react";
import { AiFillTwitterCircle, AiOutlineWhatsApp } from "react-icons/ai";
import { MdFacebook, MdContentCopy } from "react-icons/md";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ShareLinkButtonType = {
  link: string;
  social_network: string;
  phone_number?: string;
  hashtags?: string[];
};

export const ShareLinkButton: React.FC<ShareLinkButtonType> = ({
  link,
  social_network = "share-link",
  hashtags,
}) => {
  const [copyStatus, setCopyStatus] = React.useState("Copiar enlace");

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopyStatus("Copiado!");
        setTimeout(() => setCopyStatus("Copiar enlace"), 2000);
      })
      .catch(() => {
        setCopyStatus("No se pudo copiar el enlace");
      });
  };

  const getSocialButton = () => {
  switch (social_network) {
      case "whatsapp": {
      const encodedMessage = encodeURIComponent(
        `Mira este Evento en Encoro:\n${link}`
      );
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        return (
          <Link 
            href={whatsappUrl} 
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <AiOutlineWhatsApp size={24} />
        </Link>
      );
      }

      case "facebook": {
        const encodedUrl = encodeURIComponent(link);
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        return (
          <Link 
            href={shareUrl} 
            target="_blank" 
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <MdFacebook size={24} />
        </Link>
      );
      }

      case "twitter": {
      const encodedText = encodeURIComponent(`Encontre este evento en Encoro`);
        const encodedUrl = encodeURIComponent(link);
      const encodedHashtags = hashtags
        ? encodeURIComponent(hashtags.join(","))
        : "";

      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedHashtags}`;
        return (
          <Link 
            href={twitterUrl} 
            target="_blank" 
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <AiFillTwitterCircle size={24} />
        </Link>
      );
      }

      case "share-link": {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
        <button
          onClick={handleCopyClick}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
        >
                  <MdContentCopy size={24} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{copyStatus}</p>
              </TooltipContent>
              </Tooltip>
          </TooltipProvider>
      );
      }

      default:
        return null;
  }
  };

  return getSocialButton();
};
