import Image from "next/image";

interface ChainsawIconProps {
  size?: number;
  className?: string;
}

export function ChainsawIcon({ size = 24, className }: ChainsawIconProps) {
  return (
    <Image
      src="/chainsaw.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{
        filter:
          "brightness(0) saturate(100%) invert(29%) sepia(93%) saturate(6040%) hue-rotate(352deg) brightness(99%) contrast(91%)",
      }}
    />
  );
}
