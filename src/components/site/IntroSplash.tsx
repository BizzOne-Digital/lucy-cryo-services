import { LotusMark } from "./icons";

/**
 * Runs before first paint: marks JS as available and skips the splash
 * if it has already played in this browser session.
 */
export const introBootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('lc-intro')){d.classList.add('intro-seen')}else{sessionStorage.setItem('lc-intro','1')}}catch(e){d.classList.add('intro-seen')}})();`;

/** Brand intro shown once per session. Pure CSS – it removes itself, no JavaScript timers. */
export function IntroSplash({ brand, business }: { brand: string; business: string }) {
  return (
    <div className="intro-splash" aria-hidden>
      <div className="text-center">
        <LotusMark size={92} className="intro-splash__mark mx-auto text-teal" />
        <p className="intro-splash__title mt-4 font-serif text-5xl font-semibold text-navy italic sm:text-6xl">{brand}</p>
        <span className="intro-splash__line mx-auto mt-3 block h-0.5 w-28 origin-left rounded-full bg-aqua" />
        <p className="intro-splash__title mt-3 text-xs tracking-[0.4em] text-teal uppercase" style={{ animationDelay: "0.55s" }}>
          {business}
        </p>
      </div>
    </div>
  );
}
