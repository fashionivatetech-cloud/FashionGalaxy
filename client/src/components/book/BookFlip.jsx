import { useRef, useState, useLayoutEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import IntroPage from '../pages/IntroPage';
import PrefarePage from '../pages/PrefarePage';
import SearchPage from '../portal/SearchPage';
import EditorialProfile from '../editorial/EditorialProfile';
import FlipButton from './FlipButton';

// react-pageflip requires each page wrapped in a forwardRef component
const Page = forwardRef(({ children }, ref) => (
  <div ref={ref} className="page-wrapper" style={{ width: '100%', height: '100%' }}>
    {children}
  </div>
));
Page.displayName = 'Page';

/**
 * NoResultsPage — editorial language per customer brief §22
 */
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

        {/* Heading — editorial language */}
        <div className="no-results-heading">
          <h2>The Star You Are Looking For<br />was not found in Galaxy.</h2>
          <div className="no-results-divider" />
        </div>

        {/* Message */}
        <p className="no-results-msg">
          Please try again with correct Name,Location,Profession/Category
        </p>

        {/* Tips */}
        {/* <ul className="no-results-tips">
          <li>✦ Search by first name only</li>
          <li>✦ Try a broader city (e.g. &ldquo;Mumbai&rdquo;)</li>
          <li>✦ Leave all fields empty to browse all</li>
        </ul> */}

        {/* CTA — editorial language */}
        <button className="back-btn" id="go-back-btn" onClick={onGoBack}>
          Return to Index →
        </button>
      </div>
    </div>
  );
}

/**
 * Page order:
 *   0 = IntroPage
 *   1 = PrefarePage
 *   2 = SearchPage
 *   3+ = EditorialProfile or NoResultsPage
 *
 * FIXED_PAGES = 3 (intro + preface + search)
 */
const FIXED_PAGES = 3;

export default function BookFlip() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [profiles, setProfiles] = useState(null); // null = no search yet

  // Result pages: either profile array, a single 'no-results' sentinel, or empty
  const resultPages = profiles === null ? [] : profiles.length > 0 ? profiles : ['no-results'];
  const totalPages = FIXED_PAGES + resultPages.length;

  const handleSearchResults = (results) => {
    setProfiles(results);
    // Flip to first result page (index FIXED_PAGES) right after state update
    setTimeout(() => {
      bookRef.current?.pageFlip()?.flip(FIXED_PAGES);
    }, 80);
  };

  const handleFlipNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const handleFlipPrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const handleGoBack = () => {
    // Animate flip back to search page, then clear results
    bookRef.current?.pageFlip()?.flip(2); // page index 2 = Search
    setTimeout(() => {
      setProfiles(null);
    }, 800);
  };

  const handlePageChange = (e) => {
    setCurrentPage(e.data);
  };

  // ── canNext logic ──────────────────────────────────────────────
  // Block forward on Search page (no profiles yet) AND on last profile page
  const isOnSearchPage = currentPage === 2;
  const isOnLastPage = currentPage === totalPages - 1;
  const canNext = !isOnSearchPage && !isOnLastPage && currentPage < totalPages - 1;
  const canPrev = currentPage > 0;

  // Responsive dimensions
  const [dims, setDims] = useState(() => ({
    width: Math.min(window.innerWidth, 430),
    height: window.innerHeight - 72,
  }));

  useLayoutEffect(() => {
    let lastWidth = window.innerWidth;
    const update = () => {
      // Avoid re-rendering the flipbook when a mobile keyboard opens (height shrinks while width stays same)
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
          useMouseEvents={false}
          clickEventForward={true}
          usePortrait={true}
          startPage={0}
          drawShadow={true}
          autoSize={false}
          mobileScrollSupport={true}
          onFlip={handlePageChange}
          className="flip-book"
          style={{ overflow: 'hidden' }}
        >
          {/* Page 0 — Intro */}
          <Page>
            <IntroPage />
          </Page>

          {/* Page 1 — Preface */}
          <Page>
            <PrefarePage />
          </Page>

          {/* Page 2 — Search */}
          <Page>
            <SearchPage onResults={handleSearchResults} />
          </Page>

          {/* Pages 3+ — Editorial profiles or no-results */}
          {resultPages.map((item, i) =>
            item === 'no-results' ? (
              <Page key="no-results">
                <NoResultsPage onGoBack={handleGoBack} />
              </Page>
            ) : (
              <Page key={item._id || i}>
                <EditorialProfile profile={item} />
              </Page>
            )
          )}
        </HTMLFlipBook>
      </div>

      {/* Bottom navigation */}
      <FlipButton
        onPrev={handleFlipPrev}
        onNext={handleFlipNext}
        canPrev={canPrev}
        canNext={canNext}
        current={currentPage}
        total={totalPages}
      />
    </div>
  );
}
