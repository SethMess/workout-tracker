'use client'
// components/UploadWorkout.tsx

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { createClient } from '@/utils/supabase/client'
import { parseWorkoutSheet } from '@/utils/spreadsheet/parseWorkout'

export default function UploadWorkout() {
  const [workoutName, setWorkoutName] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // const data = await file.arrayBuffer()
    // const workbook = XLSX.read(data)
    // const sheet = workbook.Sheets[workbook.SheetNames[0]]
    // const json = XLSX.utils.sheet_to_json(sheet)

    const grouped: Record<string, any[]> = parseWorkoutSheet(file) //cast to workbook type and look at types &&&&&&&&&&&&&&&&

    const supabase = createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      console.error('User not authenticated')
      return
    }

    await supabase.from('workouts').insert({
      user_id: session.user.id,
      name: workoutName || 'Untitled Workout',
      exercises: json,
    })
  }


  //add submit workout button &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className="border p-2 w-full"
      />
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> 
    </div>
  )
}
