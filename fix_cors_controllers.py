import os

root_dir = r"d:\JAVA_KT_CUOI_KY\JAVA_Tu_Lam\demo\src\main\java\com\example\demo\controller"

target_string = '@CrossOrigin(origins = "http://localhost:5173")'
replacement_string = '// ' + target_string

def fix_cors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if target_string in content:
        new_content = content.replace(target_string, replacement_string)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Commented out CrossOrigin in {filepath}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".java"):
            fix_cors(os.path.join(root, file))
