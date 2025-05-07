import { appHttp } from '@/helpers'
import { formatDate } from '@vueuse/core'

// const vuejsId = 137078487
// const vueuseId = 765520339

class GithubService {
  async listStarredProjects(): Promise<unknown> {
    const result = await appHttp.get<unknown>('/github/user/starred')

    return result
  }

  async getVuejsRepository(): Promise<Record<string, number>> {
    const result = await appHttp.get<Record<string, any>>(`/github/repos/vuejs/core`)

    return {
      forksCount: result?.data.forks_count,
      issuesCount: result?.data.open_issues_count,
      stargazersCount: result?.data.stargazers_count
    }
  }

  async getVuejsIssues(): Promise<Array<Record<string, any>>> {
    const result = await appHttp.get<Array<Record<string, any>>>(
      `/github/repos/vuejs/core/issues`,
      {
        params: {
          per_page: 100
        }
      }
    )

    return this.transformDashboardLineChartData(result.data, 'created_at')
  }

  async getVuejsForks(): Promise<Array<Record<string, any>>> {
    const result = await appHttp.get<Array<Record<string, any>>>(`/github/repos/vuejs/core/forks`, {
      params: {
        per_page: 100
      }
    })

    return this.transformDashboardLineChartData(result.data, 'created_at')
  }

  async getVuejsStargazers(): Promise<Array<Record<string, string>>> {
    const result = await appHttp.get<Array<Record<string, string>>>(
      `/github/repos/vuejs/core/stargazers`,
      {
        headers: {
          Accept: 'application/vnd.github.star+json'
        },
        params: {
          page: 400,
          per_page: 100
        }
      }
    )

    return this.transformDashboardLineChartData(result.data, 'starred_at')
  }

  private transformDashboardLineChartData(
    source: Array<Record<string, any>>,
    dateFiled: string
  ): Array<Record<string, any>> {
    return source.reduce(
      (items: Array<Record<string, any>>, item) => {
        const date = formatDate(new Date(item[dateFiled]), 'YYYY-MM-DD')
        const exitingItem = items.find((titem) => titem.date === date)
        if (exitingItem) {
          exitingItem.count += 1
        } else {
          items.unshift({
            date: date,
            count: 1
          })
        }

        return items
      },
      [] as Array<Record<string, any>>
    )
  }

  async getVuejsCommits(page: number = 0, pageSize: number = 100) {
    const result = await appHttp.get<Array<Record<string, any>>>(
      `/github/repos/vuejs/core/commits`,
      {
        params: {
          per_page: pageSize,
          page
        }
      }
    )

    return result.data.reduce(
      (items: Array<Record<string, any>>, item) => {
        items.push({
          name: item.commit.author.name,
          avatarUrl: item.committer.avatar_url,
          message: item.commit.message,
          email: item.commit.author.email,
          date: formatDate(new Date(item.commit.committer.date), 'YYYY-MM-DD')
        })

        return items
      },
      [] as Array<Record<string, any>>
    )
  }

  async getVuejsCommitsStat(
    page: number = 0,
    pageSize: number = 100
  ): Promise<Array<Record<string, any>>> {
    const result = await appHttp.get<Array<Record<string, any>>>(
      `/github/repos/vuejs/core/commits`,
      {
        params: {
          per_page: pageSize,
          page
        }
      }
    )

    console.log(result)

    return result.data.reduce(
      (items: Array<Record<string, any>>, item) => {
        const committer = items.find((titem) => titem.name === item.commit.author.name)
        if (committer) {
          committer.count += 1
        } else {
          items.unshift({
            name: item.commit.author.name,
            avatarUrl: item.committer.avatar_url,
            count: 1,
            date: formatDate(new Date(item.commit.committer.date), 'YYYY-MM-DD 以来')
          })
        }
        return items
      },
      [] as Array<Record<string, any>>
    )
  }
}

const githubService = new GithubService()

export { githubService }
