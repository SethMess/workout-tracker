import { createClient } from '@/utils/supabase/server' // Ensure this import is correct
import UploadWorkout from '@/components/UploadWorkout'
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {

  // Await the client creation since it's async
  const supabase = await createClient();

  // 1. Check if Supabase client was created successfully (optional, as createServerClient usually throws on critical errors)
  // if (!supabase) { // This check might be less necessary now, but doesn't hurt
  //   console.error("Failed to create Supabase client.");
  //   return redirect("/error?message=Supabase+client+failed+to+initialize");
  // }

  // 2. Check if the auth module exists (it should if the client is valid)
  // This check is still valid after awaiting
  if (!supabase.auth) {
     console.error("Supabase client is missing the 'auth' module.");
     return redirect("/error?message=Supabase+auth+module+missing");
  }

  // 3. Attempt to get the user and handle errors
  const { data, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    console.error("Error fetching user:", getUserError.message);
    // Redirect to sign-in as the user likely needs to authenticate
    return redirect("/sign-in");
  }

  // 4. Check if the user object exists within the data
  // Use optional chaining safely
  const user = data?.user;

  if (!user) {
    console.log("No active user session found. Redirecting to sign-in.");
    return redirect("/sign-in");
  }

  // --- Fetch workouts (rest of the component) ---
  const { data: workouts, error: workoutsError } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (workoutsError) {
    console.error("Error fetching workouts:", workoutsError.message);
    // Handle error, maybe show a message to the user
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">My Workouts</h1>
      <UploadWorkout />
      <ul className="mt-4 space-y-2">
        {workouts?.map((w) => (
          <li key={w.id} className="border p-2 rounded">
            <h2 className="font-semibold">{w.name}</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {w.exercises ? JSON.stringify(w.exercises, null, 2) : 'No exercises data'}
            </pre>
          </li>
        ))}
        {(!workouts || workouts.length === 0) && <p>No workouts found.</p>}
      </ul>
    </div>
  )
}