import requests
from bs4 import BeautifulSoup
import re

base_url = "https://www.parliament.gh/docs?type=HS&P="
pdfs = []

for offset in range(0, 2000, 50):  # adjust if more pages exist
    url = f"{base_url}{offset}"
    print(f"Scraping page with P={offset}...")

    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    rows = soup.select("table tbody tr[onclick]")
    if not rows:
        print("No more PDFs found — stopping.")
        break

    for tr in rows:
        onclick = tr.get("onclick", "")
        match = re.search(r"showPDF\('([^']+)','([^']+)'\)", onclick)
        if match:
            pdf_path = match.group(1).strip()
            title_raw = match.group(2).strip()

            # Extract year and clean title
            year_match = re.search(r"(\d{4})", title_raw)
            year = year_match.group(1) if year_match else ""
            title_clean = re.sub(r",?\s*\d{4}", "", title_raw).strip()

            pdfs.append({
                "link": f"https://www.parliament.gh/epanel/docs/{pdf_path}",
                "title": title_clean,
                "year": year
            })

print(f"\n✅ Found {len(pdfs)} documents:\n")
for doc in pdfs:
    print(f"Title: {doc['title']} | Year: {doc['year']} | Link: {doc['link']}")
