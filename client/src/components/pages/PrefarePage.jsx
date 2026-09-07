/**
 * PrefarePage — Editorial preface about Fashion Galaxy.
 * Sits between IntroPage and SearchPage in the book.
 */
export default function PrefarePage() {
  return (
    <div className="page preface-page">
      {/* Ambient glow top-left */}
      <div className="preface-glow preface-glow--tl" />
      {/* Ambient glow bottom-right */}
      <div className="preface-glow preface-glow--br" />

      <div className="preface-inner">

        {/* Eyebrow */}
        <div className="preface-eyebrow">Preface</div>

        {/* Main heading */}


        {/* Thin gold rule */}
        <div className="preface-rule" />

        {/* Body copy */}
        <div className="preface-body">
          <p style={{ fontSize: 14 }}>
            FASHION GALAXY by FASHIONIVATE is a people-centred, living archive built around the individuals who make fashion what it is. As our first step in empowering this industry, it reclaims identity by moving beyond rigid titles, résumés, and fleeting trends. We believe everyone who shapes fashion is a star—and everyone deserves a place to be seen, heard, understood, and remembered.
          </p>
          <p style={{ fontSize: 14 }}>
            <span style={{ textDecoration: "underline" }}>
              Salient Features of the Galaxy:
            </span>
            <br></br>
            <br></br>
            <span style={{ textDecoration: "underline" }}>BE SEEN</span> — Represent yourself as you wish to be seen, rather than being defined by what happens to perform, trend, or attract attention.
            <br />
            <br />

            <span style={{ textDecoration: "underline" }}>BE UNDERSTOOD</span> — Let your story and course of life provide the context that a profile, résumé, or portfolio alone cannot.
            <br />
            <br />

            <span style={{ textDecoration: "underline" }}>BE REMEMBERED</span> — Give your work, contributions, and course of life a lasting place in the memory of fashion, beyond a passing moment of visibility.
            <br />
            <br />

            <span style={{ textDecoration: "underline" }}>BE CONNECTED</span> — Discover and connect with people across fashion naturally, whether it leads to friendship, collaboration, mentorship, opportunity, employment, or something entirely unexpected.


          </p>
        </div>
      </div>
    </div>
  );
}
