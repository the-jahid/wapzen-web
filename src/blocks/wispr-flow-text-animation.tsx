/**
 * Wispr-style flowing text — a paragraph running along a hand-drawn bezier,
 * scrolling forever. Adapted from @aceternity/wispr-flow-text-animation: the
 * lab's path editor (drag handles, "Edit path" toggle) and its white full-page
 * shell are dropped, since here the curve is fixed and the whole thing is a
 * background layer. The curve geometry is the lab's, unchanged.
 */

type Point = { x: number; y: number };
type Cubic = { p1: Point; p2: Point; p3: Point };

const VIEW_W = 1048;
const VIEW_H = 594;

const CURVE_START: Point = { x: 0.597656, y: 50.924805 };

const CURVE_SEGMENTS: Cubic[] = [
  {
    p1: { x: 17.4612, y: 143.2965 },
    p2: { x: 97.8522, y: 293.141 },
    p3: { x: 284.508, y: 353.548 },
  },
  {
    p1: { x: 440.828, y: 399.056 },
    p2: { x: 583.839, y: 294.067 },
    p3: { x: 500.618, y: 184.7492 },
  },
  {
    p1: { x: 417.397, y: 75.4309 },
    p2: { x: 238.217, y: 282.098 },
    p3: { x: 499.258, y: 441.668 },
  },
  {
    p1: { x: 551.913, y: 477.802 },
    p2: { x: 817.468, y: 561.26 },
    p3: { x: 1046.43, y: 565.235 },
  },
];

const CURVE_D =
  `M${CURVE_START.x} ${CURVE_START.y}` +
  CURVE_SEGMENTS.map(
    (s) => `C${s.p1.x} ${s.p1.y} ${s.p2.x} ${s.p2.y} ${s.p3.x} ${s.p3.y}`,
  ).join("");

export type WisprFlowTextProps = {
  /** The copy that rides the curve. */
  text: string;
  /** Higher is faster. The lab's scale: 5 (crawl) to 60 (brisk). */
  speed?: number;
  fontSize?: number;
  textColor?: string;
  textOpacity?: number;
  /** The curve itself; `transparent` leaves only the text visible. */
  strokeColor?: string;
  /** Unique per instance — SVG ids are document-global. */
  id?: string;
  className?: string;
};

export function WisprFlowText({
  text,
  speed = 25,
  fontSize = 15,
  textColor = "#1A1A1A",
  textOpacity = 0.4,
  strokeColor = "transparent",
  id = "wispr-flow",
  className,
}: WisprFlowTextProps) {
  const curveId = `${id}-curve`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={CURVE_D} fill="transparent" id={curveId} stroke={strokeColor} />

      <text style={{ fontSize }} x="0">
        <textPath
          className="font-normal [baseline-shift:-20%]"
          href={`#${curveId}`}
          style={{ fill: textColor, opacity: textOpacity }}
        >
          {text}
        </textPath>
        <animate
          attributeName="x"
          dur={`${65 - speed}s`}
          repeatCount="indefinite"
          values="-2000;0"
        />
      </text>
    </svg>
  );
}

export default WisprFlowText;
