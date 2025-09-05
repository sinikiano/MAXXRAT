// Supabase Auth functions
// Import supabase from supabase-app.js

// Example auth functions
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  if (error) throw error;
  return data;
}

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Add more auth functions as needed
