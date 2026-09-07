import { useRef, useState, useLayoutEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import IntroPage from './IntroPage';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import FlipButton from './FlipButton';

// react-pageflip requires each page to be wrapped in a forwardRef component
const Page = forwardRef(({ children }, ref) => (
  <div ref={ref} className="page-wrapper" style={{ width: '100%', height: '100%' }}>
    {children}
  </div>
));
Page.displayName = 'Page';

// Error page shown when search returns no results
function NoResultsPage({ onGoBack }) {
  return (
    <div className="page no-results-page">
      {/* Decorative background glow */}
      <div className="no-results-glow" />

      <div className="no-results-inner">
        {/* Icon */}
        <div className="no-results-icon-wrap">
          <div className="no-results-ring" />
          <span className="no-results-emoji">✦</span>
        </div>

        {/* Heading */}
        <div className="no-results-heading">
          <h2>No Profiles Found</h2>
          <div className="no-results-divider" />
        </div>

        {/* Message */}
        <p className="no-results-msg">
          We couldn&apos;t find anyone matching your search.
          <br />
          Try a different name, city, or department.
        </p>

        {/* Tips */}
        <ul className="no-results-tips">
          <li>✦ Search by first name only</li>
          <li>✦ Try a broader city (e.g. &ldquo;Mumbai&rdquo;)</li>
          <li>✦ Leave all fields empty to browse all</li>
        </ul>

        {/* CTA */}
        <button className="back-btn" id="go-back-btn" onClick={onGoBack}>
          ← Back to Search
        </button>
      </div>
    </div>
  );
}

export default function BookFlip() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [profiles, setProfiles] = useState(null); // null = no search yet

  // Total pages: Intro + Search + (profiles or no-results page)
  const resultPages = profiles === null ? [] : profiles.length > 0 ? profiles : ['no-results'];
  const totalPages = 2 + resultPages.length;

  const handleSearchResults = (results) => {
    setProfiles(results);
    // Flip to the first result page (index 2) right after state update
    setTimeout(() => {
      bookRef.current?.pageFlip()?.flip(2);
    }, 80);
  };

  const handleFlipNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const handleFlipPrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const handleGoBack = () => {
    // Animate the flip back to search page first, then clear results
    bookRef.current?.pageFlip()?.flip(1);
    setTimeout(() => {
      setProfiles(null);
    }, 800); // wait for flip animation to complete
  };

  const handlePageChange = (e) => {
    setCurrentPage(e.data);
  };

  // Dimensions: reactive to viewport — handles all phone sizes correctly
  const [dims, setDims] = useState(() => ({
    width: Math.min(window.innerWidth, 430),
    height: window.innerHeight - 72,
  }));

  useLayoutEffect(() => {
    let lastWidth = window.innerWidth;
    const update = () => {
      // Avoid re-rendering the flipbook when a mobile keyboard opens
      const isInputActive =
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (isInputActive && window.innerWidth === lastWidth) {
        return;
      }

      lastWidth = window.innerWidth;
      setDims({
        width: Math.min(window.innerWidth, 430),
        height: window.innerHeight - 72,
      });
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  const { width: pageWidth, height: pageHeight } = dims;

  return (
    <div className="app-shell">
      {/* Book */}
      <div className="book-flip-container">
        <HTMLFlipBook
          ref={bookRef}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          minWidth={pageWidth}
          maxWidth={pageWidth}
          minHeight={pageHeight}
          maxHeight={pageHeight}
          showCover={false}
          flippingTime={600}
          useMouseEvents={false}   // mobile: we control flip via buttons only
          clickEventForward={true}
          usePortrait={true}       // single-page view (portrait = one page at a time)
          startPage={0}
          drawShadow={true}
          autoSize={false}
          mobileScrollSupport={true}
          onFlip={handlePageChange}
          className="flip-book"
          style={{ overflow: 'hidden' }}
        >
          {/* Page 1 — Intro */}
          <Page>
            <IntroPage />
          </Page>

          {/* Page 2 — Search */}
          <Page>
            <SearchPage onResults={handleSearchResults} />
          </Page>

          {/* Pages 3+ — Profile results or no-results */}
          {resultPages.map((item, i) =>
            item === 'no-results' ? (
              <Page key="no-results">
                <NoResultsPage onGoBack={handleGoBack} />
              </Page>
            ) : (
              <Page key={item._id || i}>
                <ProfilePage profile={item} />
              </Page>
            )
          )}
        </HTMLFlipBook>
      </div>

      {/* Bottom navigation */}
      <FlipButton
        onPrev={handleFlipPrev}
        onNext={handleFlipNext}
        canPrev={currentPage > 0}
        canNext={currentPage < totalPages - 1 && currentPage !== 1}
        current={currentPage}
        total={totalPages}
      />
    </div>
  );
}
