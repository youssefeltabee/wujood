import json, os
from playwright.sync_api import sync_playwright

BASE = "https://wujood-opal.vercel.app"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    page.goto(BASE + "/", timeout=45000, wait_until="networkidle")
    page.wait_for_timeout(1500)

    # hero paragraph geometry — the vertical-strip suspect
    geo = page.evaluate("""() => {
      const out = [];
      document.querySelectorAll('main p, main [class*="max-w"], section p').forEach(el => {
        const t = (el.textContent || '').trim();
        if (t.includes('1,250') || t.includes('بيلاقوا')) {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          out.push({text: t.slice(0,40), w: Math.round(r.width), h: Math.round(r.height),
                    maxW: cs.maxWidth, display: cs.display, parentDisplay: getComputedStyle(el.parentElement).display,
                    parentW: Math.round(el.parentElement.getBoundingClientRect().width)});
        }
      });
      return out;
    }""")

    # scroll through the page, screenshot each viewport
    heights = page.evaluate("() => document.body.scrollHeight")
    shots = []
    y = 0
    i = 0
    while y < heights and i < 8:
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(1200)  # let reveal animations fire
        f = os.path.join(OUT, f"vp-{i}.jpeg")
        page.screenshot(path=f, full_page=False, type="jpeg", quality=80)
        shots.append({"y": y, "file": f})
        y += 800
        i += 1

    # counters after scroll
    counters = page.evaluate("""() => Array.from(document.querySelectorAll('main *')).filter(e =>
        /^\\+?\\d+[M%]/.test((e.textContent||'').trim()) && e.children.length === 0
      ).map(e => (e.textContent||'').trim()).slice(0,6)""")

    browser.close()

print(json.dumps({"heroGeometry": geo, "countersAfterScroll": counters, "viewportShots": shots, "pageHeight": heights}, indent=1))
