import { defineCliConfig } from 'sanity/cli'

// La CLI (cors, tokens, hooks, deploy) apunta siempre a este proyecto
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '1e8gfvjt',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
