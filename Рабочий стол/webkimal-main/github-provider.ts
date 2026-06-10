import { ResumeData, ExperienceEntry } from './resume-builder'

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  created_at: string
  updated_at: string
  fork: boolean
}

/**
 * Функция для получения данных профиля и репозиториев пользователя GitHub.
 * Позволяет автоматически наполнить резюме актуальными проектами.
 */
export async function fetchGitHubResumeData(username: string, token?: string): Promise<ResumeData> {
  const userUrl = `https://api.github.com/users/${username}`
  const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Resume-Builder-App'
  }

  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(userUrl, { headers }),
      fetch(reposUrl, { headers })
    ])

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error(`Ошибка GitHub API: ${userResponse.statusText}`)
    }

    const profile = await userResponse.json()
    const repos: GitHubRepo[] = await reposResponse.json()

    // Преобразуем репозитории в записи "опыта" (как проекты)
    const projectsAsExperience: ExperienceEntry[] = repos
      .filter((repo) => !repo.fork) // Только свои проекты
      .map((repo) => ({
        company: 'Open Source (GitHub)',
        position: repo.name,
        location: 'Remote',
        startDate: repo.created_at.split('T')[0],
        endDate: repo.updated_at.split('T')[0],
        current: false,
        highlights: [
          repo.description || 'Описание отсутствует',
          `Основной язык: ${repo.language || 'Не указан'}`,
          `Звезд: ${repo.stargazers_count}, URL: ${repo.html_url}`
        ]
      }))

    return {
      name: profile.name || profile.login,
      contact: {
        email: profile.email || '',
        location: profile.location || '',
        website: profile.blog || '',
        github: profile.html_url,
      },
      summary: profile.bio || `GitHub developer with ${profile.public_repos} public repositories.`,
      experience: projectsAsExperience,
      education: [], // GitHub не хранит данные об образовании, нужно заполнять вручную
      skills: Array.from(new Set(repos.map((r) => r.language).filter((l): l is string => Boolean(l)))).slice(0, 10)
    }
  } catch (error) {
    console.error('Не удалось вытянуть данные из GitHub:', error)
    throw error
  }
}

/**
 * Пример использования:
 * 
 * import { renderResume } from './resume-builder'
 * import { fetchGitHubResumeData } from './github-provider'
 * 
 * async function demo() {
 *   const data = await fetchGitHubResumeData('aalmaz1')
 *   const blocks = renderResume(data)
 *   console.log('Резюме успешно создано на основе данных GitHub!')
 * }
 */