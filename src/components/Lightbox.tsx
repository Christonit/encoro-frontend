import React, { useState } from "react";
import Lightbox, { ImagesListType } from "react-spring-lightbox";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
type PropsType = {
  isOpen: boolean;
  imageIndex?: number;
  handleClose: () => void;
  images: ImagesListType;
};
const LightboxComponent = ({
  isOpen,
  imageIndex = 0,
  images,
  handleClose,
}: PropsType) => {
  const [currentImageIndex, setCurrentIndex] = useState<number>(imageIndex);

  const gotoPrevious = () =>
    currentImageIndex > 0 && setCurrentIndex(currentImageIndex - 1);

  const gotoNext = () =>
    currentImageIndex + 1 < images.length &&
    setCurrentIndex(currentImageIndex + 1);

  return (
    <>
      <Lightbox
        isOpen={isOpen}
        onPrev={gotoPrevious}
        onNext={gotoNext}
        images={images}
        currentIndex={currentImageIndex}
        renderPrevButton={() => (
          <button
            className="absolute top-0 bottom-0 z-[99] m-auto left-[24px] h-[32px] max-h-[32px] max-w-[32px] flex items-center  text-white text-3xl"
            onClick={gotoPrevious}
          >
            <AiOutlineLeft />
          </button>
        )}
        renderNextButton={() => (
          <button
            className="absolute top-0 bottom-0 z-[99] m-auto right-[24px]  h-[32px] max-h-[32px] max-w-[32px] flex items-center text-white text-3xl"
            onClick={gotoNext}
          >
            <AiOutlineRight />
          </button>
        )}
        onClose={handleClose}
      />
      <div className="bg-slate-900 fixed h-full w-full top-0 left-0 z-[99] opacity-75" />
    </>
  );
};

export default LightboxComponent;
