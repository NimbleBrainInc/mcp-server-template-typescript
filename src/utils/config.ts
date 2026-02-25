/**
 * Loads required environment variables.
 * TODO: rename YOUR_API_KEY_ENV_VAR to match the env var declared in manifest.json
 * (e.g. GITHUB_TOKEN, LINEAR_API_KEY, SLACK_BOT_TOKEN)
 */
export function loadConfig() {
  const apiKey = process.env.YOUR_API_KEY_ENV_VAR;
  if (!apiKey) {
    console.error("YOUR_API_KEY_ENV_VAR environment variable is required");
    process.exit(1);
  }
  return { apiKey };
}
