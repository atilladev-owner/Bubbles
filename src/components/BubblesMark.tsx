import { MARK_CIRCLES, MARK_VIEWBOX } from '../lib/mark';

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
