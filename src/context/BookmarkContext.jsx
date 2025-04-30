"use client"

import { createContext, useState, useContext, useEffect } from "react"

const BookmarkContext = createContext()

export const useBookmarks = () => useContext(BookmarkContext)

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem("newsBookmarks")
    return savedBookmarks ? JSON.parse(savedBookmarks) : []
  })

  useEffect(() => {
    localStorage.setItem("newsBookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (article) => {
    setBookmarks((prev) => {
      // Check if already bookmarked
      if (prev.some((item) => item.url === article.url)) {
        return prev
      }
      return [...prev, article]
    })
  }

  const removeBookmark = (url) => {
    setBookmarks((prev) => prev.filter((item) => item.url !== url))
  }

  const isBookmarked = (url) => {
    return bookmarks.some((item) => item.url === url)
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}
