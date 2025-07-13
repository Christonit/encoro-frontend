import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ImportantInfoBoxProps {
  title?: string;
  children: React.ReactNode;
  buttonText?: string;
  className?: string;
}

export const ImportantInfoBox = ({
  title = "Información importante",
  children,
  buttonText = "Información importante",
  className = "",
}: ImportantInfoBoxProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const closeBox = () => {
    setIsVisible(false);
  };

  return (
    <div className={className}>
      {!isVisible && (
        <button
          className="rounded-full border-2 border-dashed border-slate-200 flex items-center gap-2 text-slate-600 px-3 py-2 font-medium bg-slate-50 hover:bg-slate-100 transition-colors"
          type="button"
          onClick={toggleVisibility}
        >
          <span className="inline-flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-slate-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="9" fill="none" />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="black"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M10 7.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-.75 2.25a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3z"
                fill="black"
              />
            </svg>
          </span>
          {buttonText}
        </button>
      )}

      {isVisible && (
        <div className="p-4 border border-slate-200 bg-slate-100 rounded-2xl mb-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button
              onClick={closeBox}
              className="text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Cerrar información"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
          <div className="text-sm lg:text-base text-slate-600 flex flex-col gap-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
