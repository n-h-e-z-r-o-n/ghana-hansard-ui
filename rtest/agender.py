import requests
from bs4 import BeautifulSoup
import re

url = "https://www.parliament.gh/docs?type=AG"

# Fetch page content
response = requests.get(url)
response.raise_for_status()
html = response.text

# Parse HTML
soup = BeautifulSoup(html, "html.parser")

data = []

# Find all <tr> tags with onclick attribute
for tr in soup.find_all("tr", attrs={"onclick": True}):
    onclick = tr.get("onclick")

    # Extract PDF link and title from the showPDF('link','title') pattern
    match = re.search(r"showPDF\('([^']+)','([^']+)'\)", onclick)
    if match:
        link = match.group(1).strip()
        title = match.group(2).strip()

        # Extract year (4-digit number)
        year_match = re.search(r"\b(20\d{2}|19\d{2})\b", title)
        year = year_match.group(1) if year_match else "Unknown"

        # Prepend the full URL if needed
        full_link = f"https://www.parliament.gh/epanel/docs/{link}"

        data.append({
            "link": full_link,
            "title": title,
            "year": year
        })

# Display results
for item in data:
    print(f"Link: {item['link']}")
    print(f"Title: {item['title']}")
    print(f"Year: {item['year']}")
    print("-" * 80)

print(f"Total records found: {len(data)}")
