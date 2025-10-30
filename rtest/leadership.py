import requests
from bs4 import BeautifulSoup
import re
import json

url = "https://www.parliament.gh/gen?LD"  # example page
html = requests.get(url).text
soup = BeautifulSoup(html, "html.parser")

# 1️⃣ Extract the <script> block containing "const data = {"
script = None
for s in soup.find_all("script"):
    if "const data" in s.text:
        script = s.text
        break

if not script:
    raise Exception("Could not find the tree data script on the page.")

# 2️⃣ Extract the JS object between "const data =" and the end
match = re.search(r"const\s+data\s*=\s*({.*?});", script, re.DOTALL)
if not match:
    raise Exception("Could not find JS data object.")
js_object = match.group(1)

# 3️⃣ Clean and convert to valid JSON
# JavaScript uses single quotes and allows trailing commas — JSON does not
cleaned = js_object \
    .replace("'", '"') \
    .replace(",}", "}") \
    .replace(",]", "]")

# 4️⃣ Parse into Python
try:
    data = json.loads(cleaned)
except json.JSONDecodeError as e:
    print("⚠️ Could not parse JSON:", e)
    # Optional: print(js_object[:500]) to debug
    data = {}

# 5️⃣ Define a recursive extractor
def extract_members(node, parent=None):
    info = []
    if "data" in node:
        d = node["data"]
        info.append({
            "name": BeautifulSoup(d.get("name", ""), "html.parser").text.strip(),
            "imageURL": d.get("imageURL"),
            "url": d.get("url"),
            "parent": parent
        })
    for child in node.get("children", []):
        info.extend(extract_members(child, parent=node["data"]["name"] if "data" in node else None))
    return info

members = extract_members(data)
print(json.dumps(members, indent=2))
print(f"\nTotal members extracted: {len(members)}")
