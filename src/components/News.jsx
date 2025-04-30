"use client"

import { useEffect, useState } from "react"
import NewsItem from "./NewsItem"
import PropTypes from "prop-types"
import InfiniteScroll from "react-infinite-scroll-component"
import NewsCardSkeleton from "./NewsCardSkeleton"
import WeatherWidget from "./WeatherWidget"

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const updateNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = `https://newsapi.org/v2/top-headlines?from=2025-04-22T00:00:00Z&sortBy=publishedAt&country=${props.country}&category=${props.category}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&page=1&pageSize=${props.pageSize}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "error") {
        throw new Error(data.message || "Error fetching news")
      }

      setArticles(data.articles || [])
      setTotalResults(data.totalResults || 0)
    } catch (error) {
      console.error("Error fetching news:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateNews()
    document.title = `${capitalizeFirstLetter(props.category)} - NewsHunt`
    // eslint-disable-next-line
  }, [props.category, props.country])

  const fetchMoreData = async () => {
    const nextPage = page + 1
    setLoadingMore(true)

    try {
      setError(null)
      const url = `https://newsapi.org/v2/top-headlines?from=2025-04-22T00:00:00Z&sortBy=publishedAt&country=${props.country}&category=${props.category}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&page=${nextPage}&pageSize=${props.pageSize}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch more news: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "error") {
        throw new Error(data.message || "Error fetching more news")
      }

      // Filter out any duplicates by article URL
      const newArticles = (data.articles || []).filter(
        (newArticle) => !articles.some((existing) => existing.url === newArticle.url),
      )

      setArticles((prev) => [...prev, ...newArticles])
      setPage(nextPage)
      setTotalResults(data.totalResults || 0)
    } catch (error) {
      console.error("Error fetching more news:", error)
      setError(error.message)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            {capitalizeFirstLetter(props.category)} News
          </h1>
          <WeatherWidget />
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button onClick={updateNews} className="mt-2 text-sm font-medium underline hover:no-underline">
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(props.pageSize)].map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length < totalResults}
            loader={
              loadingMore && articles.length < totalResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...Array(3)].map((_, index) => (
                    <NewsCardSkeleton key={index} />
                  ))}
                </div>
              ) : null
            }
            endMessage={
              articles.length > 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-8 mb-4">
                  <span className="font-medium">You've seen all the news</span>
                </p>
              )
            }
          >
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((element, index) => (
                  <div key={`${element.url}-${index}`}>
                    <NewsItem
                      title={element.title || ""}
                      description={element.description || ""}
                      imgUrl={element.urlToImage}
                      url={element.url}
                      author={element.author}
                      date={element.publishedAt}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400">No articles found</p>
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}

News.defaultProps = {
  country: "us",
  pageSize: 20,
  category: "general",
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
