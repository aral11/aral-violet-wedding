import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hhuecxtsebhitmpcpubt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWVjeHRzZWJoaXRtcGNwdWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTY3NTEsImV4cCI6MjA3MDA3Mjc1MX0.CIyqNK3LAaDGQd-zURt-eaPcmbhn1ZgTNKKYw832y9A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection...");

  try {
    // Test connection
    const { data, error } = await supabase
      .from("guests")
      .select("count", { count: "exact" });

    if (error) {
      console.error("Error connecting to Supabase:", error);
      if (error.code === "PGRST116") {
        console.log("❌ Tables do not exist. Need to create database tables.");
        return false;
      }
    } else {
      console.log("✅ Supabase connection successful!");
      console.log("✅ Tables exist and accessible");
      return true;
    }
  } catch (err) {
    console.error("Connection failed:", err);
    return false;
  }
}

testConnection().then((success) => {
  if (success) {
    console.log("🎉 Database is ready for cross-device sync!");
  } else {
    console.log("❗ Need to set up database tables first");
  }
});
