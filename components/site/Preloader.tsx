import { site } from "@/lib/site";

/**
 * Opening curtain: the iWash logo is drawn in at the centre of the screen,
 * then the panel lifts to reveal the page.
 *
 * The logo is a raster image, so it is "drawn" by animating two brush
 * strokes inside an SVG mask, one per word, which uncover it left to right.
 * Everything is CSS, so the page is never blocked on JavaScript. The
 * inline script runs before first paint and skips the curtain when it has
 * already played in this browser session.
 */
export function Preloader() {
  const { src, width, height } = site.logo;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('iw-seen')){document.documentElement.dataset.seen='1'}else{sessionStorage.setItem('iw-seen','1')}}catch(e){}",
        }}
      />
      <div className="preloader" aria-hidden="true">
        <svg className="preloader-logo" viewBox={`0 0 ${width} ${height}`} role="presentation">
          <defs>
            <mask id="iw-logo-draw" maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
              {/* stroke 1 uncovers "iWash", stroke 2 uncovers "Laundry" */}
              <path
                className="preloader-stroke preloader-stroke-1"
                d={`M-10 ${height * 0.27} L${width + 10} ${height * 0.25}`}
                strokeWidth={height * 0.52}
                pathLength={1}
              />
              <path
                className="preloader-stroke preloader-stroke-2"
                d={`M-10 ${height * 0.76} L${width + 10} ${height * 0.74}`}
                strokeWidth={height * 0.5}
                pathLength={1}
              />
            </mask>
          </defs>
          <image href={src} width={width} height={height} mask="url(#iw-logo-draw)" />
        </svg>
      </div>
    </>
  );
}
