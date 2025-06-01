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
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopyStatus("Copiado!");
        setTooltipOpen(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setTooltipOpen(false);
          setCopyStatus("Copiar enlace");
        }, 2000);
      })
      .catch(() => {
        setCopyStatus("No se pudo copiar el enlace");
        setTooltipOpen(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setTooltipOpen(false);
          setCopyStatus("Copiar enlace");
        }, 2000);
      });
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const baseBtn =
    "w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-900 transition-colors hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300";

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
            className={baseBtn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartir en WhatsApp"
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
            rel="noopener noreferrer"
            className={baseBtn}
            aria-label="Compartir en Facebook"
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
            rel="noopener noreferrer"
            className={baseBtn}
            aria-label="Compartir en Twitter"
          >
            <AiFillTwitterCircle size={24} />
          </Link>
        );
      }
      case "share-link": {
        return (
          <TooltipProvider>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopyClick}
                  className={baseBtn}
                  aria-label="Copiar enlace"
                  type="button"
                >
                  <MdContentCopy size={24} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                sideOffset={12}
                className="relative bg-black text-white font-bold px-4 py-2 rounded-md text-base shadow-lg border-none flex items-center"
                style={{ zIndex: 9999 }}
              >
                <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black" />
                <span className="ml-2">{copyStatus}</span>
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
