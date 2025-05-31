import { ReactElement } from "react";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const StatusModal = ({
  type = "success",
  message,
  show,
  title,
  closeModal,
  handleAction,
  handleActionText,
}: {
  type: "success" | "warning" | "error";
  message?: string;
  title?: string;
  handleActionText?: string;
  show: boolean;
  closeModal: () => void;
  handleAction?: () => void;
}) => {
  const heading = () => {
    switch (type) {
      case "success":
        return (
          <img
            src="/images/illustration/success-1.svg"
            alt="Evento Publicado Exitosamente Imagen"
            className="w-full h-full object-cover max-w-[200px] mb-6"
          />
        );
      case "warning":
        return (
          <AiOutlineClose className="text-yellow-500" size={64} />
        );
      case "error":
        return (
          <AiOutlineClose className="text-red-500" size={64} />
        );
      default:
        return null;
    }
  };

  const footer = () => {
    switch (type) {
      case "success":
      case "warning":
        return (
          <Button onClick={closeModal} className="w-full">
            Continuar
          </Button>
        );
      case "error":
        return (
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={closeModal} className="flex-1">
              Cerrar
            </Button>
            {handleAction && (
              <Button onClick={handleAction} className="flex-1">
                {handleActionText}
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={show} onOpenChange={closeModal}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogClose asChild>
            <button
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-900"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              <AiOutlineClose size={24} />
            </button>
          </DialogClose>
          <div className="flex flex-col items-center">
            {heading()}
            {title && <DialogTitle className="mt-5 text-center">{title}</DialogTitle>}
          </div>
        </DialogHeader>
        {message && (
          <div className="text-center px-5">
            <p className="text-md text-slate-700 mb-0 mt-2">{message}</p>
          </div>
        )}
        <DialogFooter className="justify-center py-8">{footer()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
