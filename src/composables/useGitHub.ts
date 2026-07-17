import { ref } from 'vue'

export function useGitHub() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
      let cleanUrl = url.trim().replace(/\.git$/, '').replace(/\/+$/, '')
      cleanUrl = cleanUrl.replace('https://github.com/', '').replace('git@github.com:', '')

      const [owner, repo] = cleanUrl.split('/')

      if (owner && repo) {
        return { owner, repo }
      }
    } catch (e) {
      console.error('Invalid GitHub URL format', e)
    }
    return null
  }

  async function fetchLastCommitDate(repoUrl: string): Promise<string | null> {
    const repoInfo = parseGitHubUrl(repoUrl)
    if (!repoInfo) return null

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=1`
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        return data[0].commit.committer.date
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch'
      console.error(err)
    } finally {
      isLoading.value = false
    }
    return null
  }

  return {
    fetchLastCommitDate,
    isLoading,
    error,
  }
}
