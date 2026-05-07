import pandas as pd
import json
import sys
import os

def analyze_excel(file_path):
    if not os.path.exists(file_path):
        print(f"Errore: Il file {file_path} non esiste.")
        sys.exit(1)
        
    print(f"Avvio analisi del file: {file_path}")
    
    try:
        # Get sheet names
        xl = pd.ExcelFile(file_path, engine='pyxlsb')
        sheet_names = xl.sheet_names
        print(f"Fogli trovati: {sheet_names}\n")
    except Exception as e:
        print(f"Errore nella lettura del file: {e}")
        sys.exit(1)
        
    report = []
    
    for sheet in sheet_names:
        print(f"--- Analisi del foglio: {sheet} ---")
        try:
            df = pd.read_excel(file_path, sheet_name=sheet, engine='pyxlsb')
        except Exception as e:
            print(f"Impossibile leggere il foglio {sheet}: {e}")
            continue
            
        rows, cols = df.shape
        print(f"Dimensioni: {rows} righe, {cols} colonne")
        
        if rows == 0 or cols == 0:
            print("Foglio vuoto. Salto.\n")
            continue
            
        # Analisi GAP (Valori mancanti)
        missing_data = df.isnull().sum()
        missing_percent = (missing_data / rows) * 100
        
        gaps = []
        for col, count in missing_data.items():
            if count > 0:
                pct = missing_percent[col]
                gaps.append({"colonna": col, "mancanti": int(count), "percentuale": round(pct, 2)})
                
        if gaps:
            print("GAP (Valori Mancanti):")
            gaps_sorted = sorted(gaps, key=lambda x: x["percentuale"], reverse=True)
            for g in gaps_sorted[:10]: # Mostra i top 10
                print(f"  - {g['colonna']}: {g['mancanti']} celle vuote ({g['percentuale']}%)")
            if len(gaps_sorted) > 10:
                print(f"  ...e altre {len(gaps_sorted) - 10} colonne con dati mancanti.")
        else:
            print("GAP: Nessun valore mancante rilevato!")
            
        # Analisi RIDONDANZE (Duplicati e Colonne Costanti)
        duplicates = df.duplicated().sum()
        print(f"RIDONDANZE (Righe Duplicate): {duplicates} su {rows} " + 
              (f"({round((duplicates/rows)*100, 2)}%)" if rows > 0 else ""))
              
        constant_cols = []
        for col in df.columns:
            # Dropna per ignorare i nulli e vedere se i valori rimanenti sono tutti uguali
            unique_vals = df[col].dropna().unique()
            if len(unique_vals) == 1:
                constant_cols.append(col)
                
        if constant_cols:
            print(f"RIDONDANZE (Colonne con valore costante): {len(constant_cols)}")
            for col in constant_cols[:10]:
                val = df[col].dropna().iloc[0]
                print(f"  - {col}: tutti i valori sono '{val}'")
            if len(constant_cols) > 10:
                print(f"  ...e altre {len(constant_cols) - 10} colonne costanti.")
        
        print("\n")
        
if __name__ == '__main__':
    # File passato in argomento o quello di default
    file_path = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\virgi\Desktop\LAVORO\File Contabile Anatema.xlsb"
    analyze_excel(file_path)
