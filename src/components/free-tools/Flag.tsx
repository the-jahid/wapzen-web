import Image from "next/image";
import styles from "./FreeTools.module.css";

/** A country flag served by app/flags/[file]/route.ts; decorative, so alt is empty. */
export function Flag({ iso }: { iso: string }) {
  return <Image className={styles.flag} src={`/flags/${iso}.svg`} alt="" width={24} height={16} unoptimized />;
}
