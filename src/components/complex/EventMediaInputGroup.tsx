import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import cx from "classnames";
import { AiOutlineCloseCircle, AiOutlineFileImage } from "react-icons/ai";

interface EventMediaInputGroupI {
  id: string;
  setImage: (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => void;
  defaultMedia?: string[];
  isRequired?: boolean;
  displayWarning?: boolean;
}

const RequiredStar = () => {
  return <span className="text-red-500 font-semibold">*</span>;
};

const EventMediaInputGroup: React.FC<EventMediaInputGroupI> = ({
  id,
  setImage,
  defaultMedia,
  isRequired,
  displayWarning,
}) => {
  const handleImageUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    setImage(event, index);

    if (event.target && event.target.files?.length) {
      const file = event.target.files[0];
      if (file && file.type.match("image.*")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          console.log(e.target?.result);
          const src = e.target?.result as string;
          const image: HTMLImageElement | null = document.querySelector(
            `#${id} #image-block-${index}`
          ) as HTMLImageElement;

          console.log("1", image);
          if (image) {
            image.src = src;
          } else {
            const imageTag = document.createElement("img");
            imageTag.id = `image-block-${index}`;
            imageTag.classList.add("image-block");
            imageTag.src = src;
            event.target.parentElement!.append(imageTag);

            console.log("2", event.target.parentElement);
            event.target.parentElement!.append(imageTag);
            const placeholderIcon = event.target.previousSibling as HTMLElement;
            placeholderIcon.classList.add("hidden");
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div id={id} className="relative">
      <Label className="mb-2 block">
        Media {isRequired && <RequiredStar />}
      </Label>

      <div className="mb-6">
        <div
          className={cx(
            "relative flex h-[200px] w-full max-w-xs items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4",
            {
              "border-slate-300": defaultMedia && defaultMedia[0],
            }
          )}
        >
          {defaultMedia && defaultMedia[0] ? (
            <div className="relative h-full w-full">
              <img
                id="image-block-1"
                src={defaultMedia[0]}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <AiOutlineFileImage className="h-12 w-12 text-slate-400" />
          )}
          <input
            className="absolute inset-0 cursor-pointer opacity-0"
            name="main-media"
            id={`${id}-image-1`}
            data-image="image-block-1"
            data-image-index="1"
            type="file"
            onChange={(e) => handleImageUpdate(e, 1)}
          />
        </div>
        <div className="mt-4">
          <div className="mb-3 flex flex-col items-center gap-3 lg:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("main-media")?.click()}
              className="text-sm"
            >
              Seleccionar archivo...
            </Button>
            <span className="text-base text-slate-900">
              {defaultMedia && defaultMedia[0]
                ? "..." +
                  defaultMedia[0].slice(
                    Math.round(defaultMedia[0].length / 2),
                    -1
                  )
                : " No hay archivo seleccionado."}
            </span>
          </div>
          <span className="text-sm text-slate-500">
            Solo JPG, Webp, GIF or PNG. Tamaño maximo de 3mb
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
        {[2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cx(
              "relative flex h-[120px] w-[120px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-2",
              {
                "border-slate-300": defaultMedia && defaultMedia[index - 1],
              }
            )}
          >
            {defaultMedia && defaultMedia[index - 1] ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 z-10 h-6 w-6 rounded-full bg-white/80 p-0 hover:bg-white"
                >
                  <AiOutlineCloseCircle className="h-4 w-4" />
                </Button>
                <div className="relative h-full w-full">
                  <img
                    src={defaultMedia[index - 1]}
                    alt=""
                    id={`image-block-${index}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </>
            ) : (
              <AiOutlineFileImage className="h-8 w-8 text-slate-400" />
            )}
            <input
              id={`${id}-image-${index}`}
              className="absolute inset-0 cursor-pointer opacity-0"
              data-image={`image-block-${index}`}
              data-image-index={index}
              name={`media-${index}`}
              onChange={(e) => handleImageUpdate(e, index)}
              type="file"
            />
          </div>
        ))}
      </div>
      {displayWarning && (
        <span className="absolute bottom-[-32px] text-sm text-red-500">
          Compartir una imagen para el evento es mandatorio.
        </span>
      )}
    </div>
  );
};

export default EventMediaInputGroup;
