

import re

# Mapování z ASM kódů na hodnoty v TILES
TILES = {
    "ZED": 1, "VRA": 2, "KRY": 3, "STO": 4, "JAB": 5, "KRA": 6, "TRE": 7,
    "RYB": 8, "ZIR": 9, "ZMR": 10, "DOR": 11, "POC": 12, "AUT": 13, "BAL": 14,
    "BUD": 15, "SLO": 16, "VIN": 17, "PEN": 18, "LET": 19, "KOR": 32,
    "LO1": 20, "LO2": 21, "LO3": 22, "LO4": 23, "LO5": 24, "LO6": 25,
    "LO7": 26, "LO8": 27, "LO9": 28, "LOA": 29, "LOB": 30, "LOC": 31
}

def parse_asm_levels(input_path, output_path):
    """
    Parsování souboru SCENY.ASM a generování levels.js.
    """
    try:
        with open(input_path, 'r', encoding='iso-8859-2') as f:
            content = f.read()
    except Exception as e:
        print(f"Chyba při čtení souboru: {e}")
        return

    # Rozdělí soubor na bloky levelů podle hlaviček
    level_chunks = re.split(r'(?=;\s*\d+:)', content)

    all_levels_data = []

    for chunk in level_chunks:
        if not chunk.strip() or not chunk.startswith(';'):
            continue

        # Najde všechny řádky 'db' v daném bloku
        db_lines = re.findall(r'^\s*db\s+(.*)', chunk, re.MULTILINE)
        
        if len(db_lines) != 12:
            continue

        level_data = []
        for line in db_lines:
            parts = [p.strip() for p in line.split(',')]
            row_data = []
            for part in parts:
                if not part:
                    continue
                
                if part.isdigit():
                    row_data.append(0)
                else:
                    tile_value = TILES.get(part, 0)
                    row_data.append(tile_value)
            level_data.append(row_data)
        
        all_levels_data.append(level_data)

    # Vygeneruje obsah pro levels.js
    js_output = "const levels = [\n"
    for i, level_data in enumerate(all_levels_data):
        js_output += f"    // Level {i}\n"
        js_output += "    [\n"
        for row_data in level_data:
            while len(row_data) < 20:
                row_data.append(0)
            js_output += f"        [{', '.join(map(str, row_data[:20]))}],\n"
        js_output = js_output.rstrip(',\n') + '\n' 
        js_output += "    ],\n"
    js_output = js_output.rstrip(',\n') + '\n'
    js_output += "];\n"

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_output)
    print(f"Soubor {output_path} byl úspěšně vygenerován s {len(all_levels_data)} levely.")

if __name__ == "__main__":
    asm_file = './SRC/SCENY.ASM'
    js_file = './levels.js'
    parse_asm_levels(asm_file, js_file)
