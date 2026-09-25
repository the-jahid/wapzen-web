import Image from "next/image";

// The WapZen "W" mark (green, transparent background). It is decorative:
// every place it appears sits inside a link or next to text that already
// names the brand, so the alt text stays empty.
export function BrandMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      alt=""
      className={className}
      height={199}
      priority={priority}
      src="/brand/wapzen-mark.png"
      style={{ height: "auto", width: "100%" }}
      width={256}
    />
  );
}
