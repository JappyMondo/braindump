"use client"

import { useState, useEffect } from "react"

export function useMouseIdle(delay: number): boolean {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseMove = () => {
      setIsIdle(false)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setIsIdle(true), delay)
    }

    // Initial timeout
    timeoutId = setTimeout(() => setIsIdle(true), delay)

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseMove)
    document.addEventListener("keydown", handleMouseMove)
    document.addEventListener("touchstart", handleMouseMove)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseMove)
      document.removeEventListener("keydown", handleMouseMove)
      document.removeEventListener("touchstart", handleMouseMove)
    }
  }, [delay])

  return isIdle
}

