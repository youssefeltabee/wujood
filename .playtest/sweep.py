import json, os
from playwright.sync_api import sync_playwright

BASE = "https://wujood-opal.vercel.app"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
os.makedirs(OUT, exist_ok=True)

PAGES = ["/", "/features", "/pricing", "/testimonials", "/about", "/contact", "/login", "/register"]

results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, locale="en-US")
    page = ctx.new_page()
    console_msgs = []
    page.on("console", lambda m: console_msgs.append({"page": None, "type": m.type, "text": m.text[:300]}))
    page.on("pageerror", lambda e: console_msgs.append({"page": None, "type": "PAGEERROR", "text": str(e)[:300]}))

    for path in PAGES:
        entry = {"path": path}
        try:
            resp = page.goto(BASE + path, timeout=45000, wait_until="networkidle")
            entry["status"] = resp.status if resp else None
            page.wait_for_timeout(2500)  # let animations/counters settle
            shot = os.path.join(OUT, path.strip("/").replace("/", "_") or "home")
            page.screenshot(path=shot + ".jpeg", full_page=True, type="jpeg", quality=80)
            entry["screenshot"] = shot + ".jpeg"
            for m in console_msgs:
                if m["page"] is None:
                    m["page"] = path
            entry["title"] = page.title()
        except Exception as ex:
            entry["error"] = str(ex)[:200]
        results.append(entry)

    # interactive: score check on landing
    try:
        page.goto(BASE + "/", timeout=45000, wait_until="networkidle")
        box = page.get_by_placeholder("example.com").first
        box.fill("cairocafe.example")
        page.get_by_role("button", name="See Your Score").first.click()
        page.wait_for_timeout(4000)
        page.screenshot(path=os.path.join(OUT, "score-check-after.jpeg"), full_page=False, type="jpeg", quality=80)
        results.append({"path": "/ score-check interaction", "screenshot": os.path.join(OUT, "score-check-after.jpeg")})
    except Exception as ex:
        results.append({"path": "/ score-check interaction", "error": str(ex)[:200]})

    # language switch test
    try:
        page.goto(BASE + "/", timeout=45000, wait_until="networkidle")
        page.get_by_role("button", name="Switch to English").click()
        page.wait_for_timeout(1500)
        page.screenshot(path=os.path.join(OUT, "lang-en.jpeg"), full_page=False, type="jpeg", quality=80)
        results.append({"path": "/ lang switch EN", "screenshot": os.path.join(OUT, "lang-en.jpeg")})
    except Exception as ex:
        results.append({"path": "/ lang switch EN", "error": str(ex)[:200]})

    browser.close()

print(json.dumps({"results": results, "console": console_msgs}, indent=1))
