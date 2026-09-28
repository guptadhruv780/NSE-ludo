import * as XLSX from 'xlsx';

export function exportToExcel(players) {
  const rows = players.map(p => ({
    'Player Colour': p.color,
    'Name': p.name,
    'Organisation': p.org,
    'Phone Number': p.phone,
    'Final Position': p.rank || 'Did not finish'
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Players');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  XLSX.writeFile(wb, `Invest_Safe_Ludo_${timestamp}.xlsx`);
}
