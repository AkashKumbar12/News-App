"use client"

import { useState } from "react"
import { BookmarkIcon, ShareIcon } from "./Icons"
import { useBookmarks } from "../context/BookmarkContext"

const NewsItem = (props) => {
  const { title, description, imgUrl, url, author, date } = props
  const [imageError, setImageError] = useState(false)
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()
  const bookmarked = isBookmarked(url)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleBookmarkToggle = (e) => {
    e.preventDefault()
    if (bookmarked) {
      removeBookmark(url)
    } else {
      addBookmark({
        title,
        description,
        imgUrl,
        url,
        author,
        date,
      })
    }
  }

  const handleShare = async (e) => {
    e.preventDefault()
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
          {!imageError ? (
            <img
              src={imgUrl || "/placeholder.svg"}
              onError={handleImageError}
              className="absolute top-0 left-0 w-full h-full object-cover"
              alt={title || "News image"}
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <span className="text-sm">Image not available</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleBookmarkToggle}
              className="p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            >
              <BookmarkIcon className="w-4 h-4" filled={bookmarked} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              aria-label="Share article"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
            {title || "No title available"}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
            {description || "No description available"}
          </p>
          <div className="mt-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              By {author ? author : "Unknown"} •{" "}
              {date
                ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                : "Unknown date"}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsItem
