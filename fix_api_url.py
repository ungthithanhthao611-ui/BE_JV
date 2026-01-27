import os
import re

# Directory to scan
root_dir = r"d:\JAVA_KT_CUOI_KY\FE_java_tu_lam\src"

# Regex for initializing API_URL in api/*.js files
# Matches: const API_URL = "http://localhost:8080...
api_url_pattern = re.compile(r'const API_URL = "http://localhost:8080(.*?)";')

# Regex for localhost usage in components (e.g. images)
# Matches: http://localhost:8080
localhost_pattern = re.compile(r'http://localhost:8080')

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    
    # 1. Fix API_URL definitions (mostly in api/ folder)
    # Replaces: const API_URL = "http://localhost:8080/api/products";
    # With:     const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;
    if "const API_URL =" in content:
        new_content = api_url_pattern.sub(r'const API_URL = `${import.meta.env.VITE_API_BASE_URL}\1`;', new_content)

    # 2. Fix generic localhost usage (e.g. images in JSX)
    # This is tricky because of quotes.
    # Case A: Inside backticks (template literal) -> `http://localhost:8080/images/${item.photo}`
    #         Solution: replace http://localhost:8080 with ${import.meta.env.VITE_API_BASE_URL}
    # Case B: Inside double/single quotes -> "http://localhost:8080/images/"
    #         Solution: Change to template literal or concatenation.
    
    # Simple approach for Images:
    # If we see `http://localhost:8080/images`, replace with `${import.meta.env.VITE_API_BASE_URL}/images` IF it's likely inside backticks.
    
    # Let's target specific known bad patterns for images
    # Pattern: `http://localhost:8080/images/
    # If it is inside backticks, we want `${import.meta.env.VITE_API_BASE_URL}/images/`
    
    # We'll use a specific replacement for the Image URL found in HomePage.jsx
    # Original: `http://localhost:8080/images/${item.photo}`
    # Target:   `${import.meta.env.VITE_API_BASE_URL}/images/${item.photo}`
    
    new_content = new_content.replace('`http://localhost:8080', '`${import.meta.env.VITE_API_BASE_URL}')
    
    # Also handle the fallback image case if it uses localhost
    # And handle instances where it might be "http://localhost:8080" (quotes)
    # Force replace all "http://localhost:8080" with variable? No, syntax errors.
    
    if new_content != content:
        print(f"Fixing {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".js") or file.endswith(".jsx"):
            fix_file(os.path.join(root, file))

print("Finished replacing localhost:8080")
