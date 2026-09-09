import { MARK_BUBBLE, MARK_CIRCLES, MARK_VIEWBOX, MARK_WASH } from '../lib/mark';

type Props = { size: number; className?: string };

/** The identity cluster. Decorative only, so it is hidden from assistive tech. */
export default function BubblesMark({ size, className }: Props) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {MARK_CIRCLES.map((circle) => (
        <circle
          key={circle.cx + ':' + circle.cy}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill={circle.fill}
        />
      ))}
    </svg>
  );
}

/**
 * Three bubbles from the same cluster, sitting to the left of a group heading so the
 * list reads in sections. Decorative, so it is hidden from assistive tech.
 */
export function GroupMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 26 26"
      width={26}
      height={26}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="9" cy="16" r="8" fill={MARK_BUBBLE} />
      <circle cx="19" cy="10" r="5" fill={MARK_BUBBLE} />
      <circle cx="11" cy="5" r="3.5" fill={MARK_WASH} />
    </svg>
  );
}
