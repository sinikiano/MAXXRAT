// Supabase Storage functions
// Import supabase from supabase-app.js

// Example storage functions
async function uploadFile(bucket, filePath, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);
  if (error) throw error;
  return data;
}

async function downloadFile(bucket, filePath) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);
  if (error) throw error;
  return data;
}

async function listFiles(bucket, path = '') {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);
  if (error) throw error;
  return data;
}

async function deleteFile(bucket, filePath) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  if (error) throw error;
}

async function getPublicUrl(bucket, filePath) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

// Add more storage functions as needed
