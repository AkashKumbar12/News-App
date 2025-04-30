import { useBookmarks } from "../context/BookmarkContext"
import NewsItem from "./NewsItem"
import { Link } from "react-router-dom"

const BookmarksPage = () => {
  const { bookmarks } = useBookmarks()

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Bookmarks</h1>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((article, index) => (
              <div key={`${article.url}-${index}`}>
                <NewsItem
                  title={article.title}
                  description={article.description}
                  imgUrl={article.imgUrl}
                  url={article.url}
                  author={article.author}
                  date={article.date}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No bookmarks yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Save articles to read them later or keep track of your favorite news.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse News
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookmarksPage
