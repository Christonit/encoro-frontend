import { useEffect, useRef } from "react";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";

const ToastBanner = ({
  type = "success",
  message,
  closeToast,
}: {
  type: "success" | "warning" | "error";
  message: string;
  closeToast: () => void;
}) => {
  const banner = useRef<HTMLDivElement | null>(null);

  const heading = () => {
    let message: string = "";
    switch (type) {
      case "success":
        message = "Accion realizada exitosamente";
        break;
      case "warning":
        message = "Precaucion";
        break;
      case "error":
        message = "Tenemos un problema";
        break;
    }

    return message;
  };

  useEffect(() => {
    if (banner && banner.current) {
      setTimeout(() => {
        if (banner.current?.classList.contains("intro"))
          banner.current?.classList.remove("intro");

        if (!banner.current?.classList.contains("outro"))
          banner.current?.classList.add("outro");
      }, 600);
    }
  }, [banner]);

  useEffect(() => {
    setTimeout(() => {
      closeToast();
    }, 10000);
  }, []);

  return (
    <div
      ref={banner}
      className="system-banner intro py-[20px] my-[32px] px-[16px]  border-[1px] border-slate-300 rounded-[12px] bg-slate-100 flex gap-[24px] items-center"
    >
      <AiOutlineCheckCircle size={40} />
      <div>
        <h3 className="text-lg font-semibold mb-[4px]">{heading()}</h3>
        <p className="text-base mb-0">{message}</p>
      </div>

      <button
        onClick={closeToast}
        className="ml-auto flex items-center justify-center rounded-[32px] border-[1px] border-slate-300 px-[4px] py-[4px] h-[32px] w-[32px]"
      >
        <AiOutlineClose size={20} />
      </button>
    </div>
  );
};

export default ToastBanner;
