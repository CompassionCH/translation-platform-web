import { Component, xml } from "@odoo/owl";
import { getWebPath } from "../../utils";

const LETTER_LAB_URL = import.meta.env.VITE_LETTER_LAB_URL

class AnnouncementHero extends Component {
  static template = xml`
    <div class="relative overflow-hidden rounded-xl px-7 py-6 text-white shadow-[0_16px_34px_rgba(0,74,146,0.30)]"
         style="background: radial-gradient(120% 150% at 10% -20%, rgba(255,255,255,0.22), rgba(255,255,255,0) 45%), linear-gradient(135deg, #005eb8 0%, #004a92 100%);">
      <img t-att-src="webPath('/logo_white.png')" alt="" class="pointer-events-none select-none absolute -right-10 top-1/2 w-80 -translate-y-1/2 opacity-[0.09]"/>
      <div class="relative z-10 flex flex-col gap-3">
        <div class="flex items-center gap-2.5">
          <img t-att-src="webPath('/logo_white.png')" alt="" class="w-[18px]"/>
          <span class="text-[11.5px] font-semibold uppercase tracking-[0.15em] text-white/90">AI Letter Lab</span>
          <span class="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">New</span>
        </div>
        <h3 class="max-w-[54ch] text-2xl font-bold leading-snug tracking-tight">Help us test our new AI system, built for faster and safer letter translations.</h3>
        <p class="max-w-[68ch] text-[15px] leading-relaxed text-white/90">Our new AI system helps translate the letters and checks them for safety. But only a translator’s eye can tell whether our AI is truly getting things right. We need you to be that eye. The more of you who take part, the better we can ensure the quality of every translation and the safety of every letter a child receives.</p>
        <div class="mt-1 flex flex-col items-start gap-2">
          <a t-att-href="letterLabUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-[15px] font-semibold text-slate-900 shadow-[0_5px_14px_rgba(217,119,6,0.34)] transition-all hover:-translate-y-px hover:bg-amber-600">
            <span>→</span>
            Open the AI Letter Lab
          </a>
          <span class="text-[12.5px] text-white/70">Even a few reviewed letters helps.</span>
        </div>
      </div>
    </div>
  `;

  webPath = getWebPath;
  letterLabUrl = LETTER_LAB_URL;
}

export default AnnouncementHero;
