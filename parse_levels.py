

import re

TILES = {
    'ZED': 1, 'VRA': 2, 'KRY': 3, 'STO': 4, 'JAB': 5, 'KRA': 6, 'TRE': 7, 'RYB': 8, 'ZIR': 9, 'ZMR': 10,
    'DOR': 11, 'POC': 12, 'AUT': 13, 'BAL': 14, 'BUD': 15, 'SLO': 16, 'VIN': 17, 'PEN': 18, 'LET': 19,
    'LO1': 20, 'LO2': 21, 'LO3': 22, 'LO4': 23, 'LO5': 24, 'LO6': 25, 'LO7': 26, 'LO8': 27, 'LO9': 28,
    'LOA': 29, 'LOB': 30, 'LOC': 31
}

def parse_sceny_asm(filepath):
    levels = []
    current_level = []
    in_level_section = False

    with open(filepath, 'r', encoding='cp1250') as f:
        for line in f:
            # Hledáme komentář, který značí začátek levelu
            if re.match(r'^\s*;\s*\d+:', line):
                if current_level:
                    levels.append(current_level)
                current_level = []
                in_level_section = True
                continue

            if in_level_section:
                # Zpracováváme řádky s 'db'
                if 'db' in line:
                    parts = line.split('db')[1].strip().split(',')
                    row = []
                    for part in parts:
                        # Odstraníme případné komentáře
                        item = part.split(';')[0].strip()
                        if item.isdigit():
                            row.append(int(item))
                        elif item in TILES:
                            row.append(f"TILES.{item}")
                    current_level.append(row)
                else:
                    # Konec sekce levelů
                    if current_level:
                        levels.append(current_level)
                    in_level_section = False

    # Přidání posledního levelu
    if current_level:
        levels.append(current_level)

    return levels

def main():
    levels_data = parse_sceny_asm('SRC/SCENY.ASM')

    # Vygenerování JS kódu
    js_code = "const levels = [\n"
    for i, level in enumerate(levels_data):
        js_code += f"    // Level {i}\n    [\n"
        for row in level:
            js_code += f"        [{', '.join(map(str, row))}],\n"
        js_code += "    ],\n"
    js_code += "];"

    with open("levels.js", "w") as f:
        f.write(js_code)

    print("Soubor 'levels.js' byl úspěšně vygenerován.")

if __name__ == '__main__':
    main()

