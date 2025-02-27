"use client"

import { useEffect, useState } from "react"

export function useObservable<T>(observable: Promise<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    let mounted = true

    const updateValue = async () => {
      try {
        const result = await observable
        if (mounted) {
          setValue(result)
        }
      } catch (error) {
        console.error("Error in useObservable:", error)
      }
    }

    updateValue()

    return () => {
      mounted = false
    }
  }, [observable])

  return value
}

