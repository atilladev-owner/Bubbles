import { MARK_BUBBLE, MARK_WASH } from '../lib/mark';

/**
 * The masthead cluster: two bubbles peeking from behind the wordmark's top right and one
 * larger one low on its left. The sticker sits opaque on top of it, so nothing here ever
 * crosses a letter. Decorative, so it is hidden from assistive tech.
 */
export function MastheadBubbles({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      width={200}
      height={160}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="148" cy="30" r="26" fill={MARK_BUBBLE} />
      <circle cx="186" cy="34" r="15" fill={MARK_WASH} />
      <circle cx="34" cy="126" r="33" fill={MARK_BUBBLE} />
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
      width={28}
      height={28}
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
