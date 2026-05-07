import win32com.client
import os
import sys

def analyze_excel_formulas(file_path):
    if not os.path.exists(file_path):
        print(f"Errore: Il file {file_path} non esiste.")
        return

    print(f"Analisi semantica e delle formule per: {file_path}\n")
    
    excel = win32com.client.Dispatch("Excel.Application")
    excel.Visible = False
    
    try:
        wb = excel.Workbooks.Open(file_path, ReadOnly=True)
        
        for sheet in wb.Sheets:
            print(f"=========================================")
            print(f"FOGLIO: {sheet.Name}")
            print(f"=========================================")
            
            used_range = sheet.UsedRange
            if used_range is None or used_range.Cells.Count == 1 and used_range.Cells(1,1).Value is None:
                print("Foglio vuoto.\n")
                continue
            
            # Leggi le prime righe per capire le intestazioni
            max_cols = min(used_range.Columns.Count, 30)
            headers = []
            for c in range(1, max_cols + 1):
                val = sheet.Cells(1, c).Value
                if val:
                    headers.append(f"Col {c}: {val}")
            if headers:
                print("Intestazioni rilevate (riga 1):")
                for h in headers:
                    print(f"  - {h}")
            else:
                print("Nessuna intestazione chiara nella prima riga.")
                
            print("\nFormule trovate:")
            formulas_dict = {}
            
            for row in range(1, used_range.Rows.Count + 1):
                for col in range(1, used_range.Columns.Count + 1):
                    cell = used_range.Cells(row, col)
                    if cell.HasFormula:
                        f_r1c1 = cell.FormulaR1C1
                        f_standard = cell.FormulaLocal
                        address = cell.Address
                        
                        if f_r1c1 not in formulas_dict:
                            formulas_dict[f_r1c1] = {
                                'standard': f_standard,
                                'count': 1,
                                'example_address': address
                            }
                        else:
                            formulas_dict[f_r1c1]['count'] += 1
            
            if not formulas_dict:
                print("Nessuna formula trovata in questo foglio.\n")
            else:
                print(f"Trovate {len(formulas_dict)} formule uniche (raggruppate per logica R1C1):\n")
                for f_r1c1, data in formulas_dict.items():
                    print(f"  -> Esempio Cella: {data['example_address']}")
                    print(f"  -> Formula: {data['standard']}")
                    print(f"  -> Logica: {f_r1c1}")
                    print(f"  -> Ripetuta: {data['count']} volte")
                    print("-" * 40)
            
            print("\n")
            
    except Exception as e:
        print(f"Errore durante l'analisi: {e}")
    finally:
        wb.Close(False)
        excel.Quit()

if __name__ == '__main__':
    file_path = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\virgi\Desktop\LAVORO\File Contabile Anatema.xlsb"
    analyze_excel_formulas(file_path)
