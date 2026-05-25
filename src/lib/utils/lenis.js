import { goto } from "$app/navigation";
import { page } from "$app/state";
import Lenis from "@studio-freight/lenis";

let lenis;

export function RegisterCustomRaf() {
    lenis = new Lenis({
        smooth: true,
        direction: 'vertical'
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

export async function ScrollToTarget(id, route) {
    let delay = 0;

    if (route && page.url.pathname !== route) {
        await goto(route);
        delay = 500;
    }

    setTimeout(() => {
        const target = document.getElementById(id);
        if (target) {
            lenis.scrollTo(target);
        }
    }, delay);
}