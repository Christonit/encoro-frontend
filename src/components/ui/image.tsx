"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

// TODO: Placeholder Loading Animation is not working
const ImageUI = ({ src, width = 200, height = 200, ...props }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  //   if (isLoading) {
  //     return (
  //       <div
  //         className={`animate-pulse bg-muted rounded-lg h-[${props.height}px] w-[${props.width}px] w-full absolute `}
  //       ></div>
  //     );
  //   }
  return (
    <Image
      {...props}
      src={src}
      width={width}
      height={height}
      alt={props.alt ?? ""}
      //   onLoadingComplete={() => setIsLoading(false)}
    />
  );
};

export default ImageUI;
