"use client"

import { useState, useEffect, useRef } from "react"
import { CloseIcon, SearchIcon } from "./Icons"
import { useNavigate } from "react-router-dom"

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Focus the input when the modal opens
    inputRef.current?.focus()

    // Add event listener to close on escape key
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)

    // Prevent scrolling on the body
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [onClose])

  useEffect(() => {
    const searchNews = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}&pageSize=10`
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === "ok") {
          setResults(data.articles || [])
        } else {
          console.error("Search error:", data.message)
          setResults([])
        }
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        searchNews()
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleResultClick = (url) => {
    window.open(url, "_blank")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for news..."
            className="flex-grow bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg"
          />
          <button
            onClick={onClose}
            className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Close search"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((article, index) => (
                <li key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <button onClick={() => handleResultClick(article.url)} className="p-4 w-full text-left flex">
                    {article.urlToImage && (
                      <div className="flex-shrink-0 h-16 w-16 mr-4">
                        <img
                          src={article.urlToImage || "/placeholder.svg"}
                          alt=""
                          className="h-full w-full object-cover rounded"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              <p>Type to search for news</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
