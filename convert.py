import os
from PIL import Image

# Standardní 16barevná EGA/VGA paleta
EGA_VGA_PALETTE = [
    0, 0, 0,        # 0: Černá
    0, 0, 170,      # 1: Modrá
    0, 170, 0,      # 2: Zelená
    0, 170, 170,    # 3: Azurová
    170, 0, 0,      # 4: Červená
    170, 0, 170,    # 5: Purpurová
    170, 85, 0,     # 6: Hnědá
    170, 170, 170,  # 7: Světle šedá
    85, 85, 85,     # 8: Tmavě šedá
    85, 85, 255,    # 9: Světle modrá
    85, 255, 85,    # 10: Světle zelená
    85, 255, 255,   # 11: Světle azurová
    255, 85, 85,    # 12: Světle červená
    255, 85, 255,   # 13: Světle purpurová
    255, 255, 85,   # 14: Žlutá
    255, 255, 255,  # 15: Bílá
]

def convert_scr_to_png(scr_path, png_path, width, height):
    """Převede .SCR soubor (planární VGA grafika) na PNG obrázek."""
    try:
        with open(scr_path, 'rb') as f:
            data = f.read()

        img = Image.new('P', (width, height))
        img.putpalette(EGA_VGA_PALETTE)
        
        pixels = [0] * (width * height)
        plane_size = (width // 8) * height
        
        for plane in range(4):
            plane_data_start = plane * plane_size
            plane_data_end = plane_data_start + plane_size
            plane_data = data[plane_data_start:plane_data_end]
            
            for y in range(height):
                for x_byte in range(width // 8):
                    byte_index = y * (width // 8) + x_byte
                    if byte_index < len(plane_data):
                        byte = plane_data[byte_index]
                        for bit in range(8):
                            pixel_index = y * width + x_byte * 8 + (7 - bit)
                            if (byte >> bit) & 1:
                                pixels[pixel_index] |= (1 << plane)

        img.putdata(pixels)
        img.save(png_path)
        print(f"Převedeno: {scr_path} -> {png_path}")

    except FileNotFoundError:
        print(f"Chyba: Soubor {scr_path} nebyl nalezen.")
    except Exception as e:
        print(f"Chyba při převodu {scr_path}: {e}")

def main():
    """Hlavní funkce pro konverzi všech .SCR souborů."""
    if not os.path.exists('assets'):
        os.makedirs('assets')

    # Adresáře se sprity
    sprite_dirs = ['SRC/VECI', 'SRC/VAGONY', 'SRC/RUZNE']
    for directory in sprite_dirs:
        if not os.path.isdir(directory):
            print(f"Adresář nenalezen: {directory}")
            continue
        for filename in os.listdir(directory):
            if filename.endswith('.SCR'):
                scr_path = os.path.join(directory, filename)
                png_path = os.path.join('assets', f"{os.path.splitext(filename)[0]}.png")
                # Velikost spritu je 16x16
                convert_scr_to_png(scr_path, png_path, 16, 16)

    # Titulní obrazovka
    titulek_path = 'SRC/TITULEK.SCR'
    if os.path.exists(titulek_path):
        png_path = os.path.join('assets', 'TITULEK.png')
        # Velikost titulku je 256x16
        convert_scr_to_png(titulek_path, png_path, 256, 16)
    else:
        print(f"Titulní obrazovka nenalezena: {titulek_path}")

if __name__ == '__main__':
    main()