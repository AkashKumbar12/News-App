"use client"

import Navbar from "./components/Navbar"
import News from "./components/News"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { BookmarkProvider } from "./context/BookmarkContext"
import BookmarksPage from "./components/BookmarksPage"

const App = () => {
  const pageSize = 9

  return (
    <BookmarkProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <Routes>
            <Route
              exact
              path="/"
              element={<News key="general" pageSize={pageSize} country="us" category="general" />}
            />
            <Route
              exact
              path="/home"
              element={<News key="general" pageSize={pageSize} country="us" category="general" />}
            />
            <Route
              exact
              path="/business"
              element={<News key="business" pageSize={pageSize} country="us" category="business" />}
            />
            <Route
              exact
              path="/entertainment"
              element={<News key="entertainment" pageSize={pageSize} country="us" category="entertainment" />}
            />
            <Route
              exact
              path="/health"
              element={<News key="health" pageSize={pageSize} country="us" category="health" />}
            />
            <Route
              exact
              path="/science"
              element={<News key="science" pageSize={pageSize} country="us" category="science" />}
            />
            <Route
              exact
              path="/sports"
              element={<News key="sports" pageSize={pageSize} country="us" category="sports" />}
            />
            <Route
              exact
              path="/technology"
              element={<News key="technology" pageSize={pageSize} country="us" category="technology" />}
            />
            <Route exact path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </div>
      </Router>
    </BookmarkProvider>
  )
}

export default App
