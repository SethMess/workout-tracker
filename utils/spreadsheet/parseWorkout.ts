import * as XLSX from 'xlsx'

export async function parseWorkoutFile(file: File) {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const json = XLSX.utils.sheet_to_json(sheet)

  return json // you can transform this to your DB schema
}



export async function parseWorkoutSheet (workbook: XLSX.WorkBook){
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

  // Assume first row is header: ["Day", "Exercise", "Sets", "Reps", "Weight"]
  const data = rows.slice(1)
  const grouped: Record<string, any[]> = {}

  for (const row of data) {
    const [day, name, sets, reps, weight] = row
    if (!grouped[day]) grouped[day] = []
    grouped[day].push({ name, sets, reps, weight })
  }

  return grouped
}
