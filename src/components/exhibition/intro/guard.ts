/** sessionStorage flag: the intro has played in this browser session. */
export const SEEN_KEY = "avc-intro-seen";

/**
 * Runs in <head> before first paint: hides the intro overlay for returning
 * visitors and reduced-motion users, so it never flashes.
 */
export const introGuardScript = `try{if(sessionStorage.getItem("${SEEN_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-avc-intro","skip")}catch(e){}`;
