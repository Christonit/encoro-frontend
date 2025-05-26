import { useRef, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({
  message,
  show,
  ilustration,
  title,
  closeModal,
  continueAction,
}: {
  ilustration?: ReactNode;
  message?: string | ReactNode;
  title?: string;
  show: boolean;
  closeModal?: () => void;
  continueAction?: () => void;
}) => {
  const modal = useRef<HTMLDivElement | null>(null);

  return (
    <Dialog open={show} onOpenChange={closeModal}>
      <DialogContent ref={modal} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </DialogClose>
        </DialogHeader>
        <div className="flex items-center flex-col">
          {ilustration}
          {title && <DialogTitle className="mt-5">{title}</DialogTitle>}
        </div>

        <div className="text-center px-5 lg:px-8">
          {message ? (
            typeof message === "string" ? (
              <p className="text-sm text-muted-foreground mb-0 mt-2">{message}</p>
            ) : (
              message
            )
          ) : null}
        </div>

        <DialogFooter className="flex justify-center gap-4 py-8">
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button onClick={continueAction}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
