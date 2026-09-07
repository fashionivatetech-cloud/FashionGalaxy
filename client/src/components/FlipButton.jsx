export default function FlipButton({ onPrev, onNext, canPrev, canNext, current, total }) {
  // Page labels: 1 = Intro, 2 = Search, 3+ = Profiles
  const label =
    current === 0
      ? 'Intro'
      : current === 1
        ? 'Search'
        : `Profile ${current - 1} of ${total - 2}`;

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
        →
      </button>
    </nav>
  );
}
