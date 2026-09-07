/**
 * FlipButton — bottom navigation bar
 *
 * Page order:
 *   0 = Intro
 *   1 = Preface
 *   2 = Search
 *   3+ = Profile results
 */
export default function FlipButton({ onPrev, onNext, canPrev, canNext, current, total }) {
  const label =
    current === 0
      ? 'Intro'
      : current === 1
        ? 'Preface'
        : current === 2
          ? 'Search'
          : `Profile ${current - 2} of ${total - 3}`;

  return (
    <nav className="flip-nav" aria-label="Page navigation">
      <button
        id="flip-prev-btn"
        className="flip-btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        Back
      </button>

      {/* <div className="flip-page-indicator" aria-live="polite">
        {label}
      </div> */}

      <button
        id="flip-next-btn"
        className="flip-btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
      >
        Flip
      </button>
    </nav>
  );
}
