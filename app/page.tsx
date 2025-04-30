"use client"

import dynamic from "next/dynamic"

// Use dynamic import with ssr: false to prevent hydration issues with React Router
const App = dynamic(() => import("../src/App"), { ssr: false })

export default function Page() {
  return <App />
}
