import { createClient } from '@/utils/supabase/client'

export async function getWorkoutPlans() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function insertWorkoutPlan(userId: string, workouts: any[]) {
  const supabase = createClient()

  const { error } = await supabase.from('workout_plans').insert([
    {
      user_id: userId,
      title: 'Imported Plan',
      description: 'From spreadsheet',
      // add any additional structure here
    },
  ])

  if (error) throw error
}
