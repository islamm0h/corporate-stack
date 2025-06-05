import { useEffect, useState } from 'react'

/**
 * Hook لحل مشكلة Hydration في Next.js
 * يضمن أن المكون يتم عرضه فقط على العميل
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook لتوليد أرقام عشوائية آمنة من Hydration
 */
export function useStableRandom(seed?: number) {
  const [randomValue, setRandomValue] = useState<number | null>(null)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      if (seed) {
        // استخدام seed للحصول على نفس القيمة
        setRandomValue(seed)
      } else {
        setRandomValue(Math.random())
      }
    }
  }, [isClient, seed])

  return randomValue
}

/**
 * Hook لتوليد أرقام طلبات آمنة من Hydration
 */
export function useRequestNumber() {
  const [requestNumber, setRequestNumber] = useState<string>('')
  const isClient = useClientOnly()

  const generateRequestNumber = () => {
    if (isClient) {
      const number = Math.floor(100000 + Math.random() * 900000).toString()
      setRequestNumber(number)
      return number
    }
    return ''
  }

  return { requestNumber, generateRequestNumber }
}

/**
 * Hook آمن للوصول إلى localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key, isClient])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook آمن للوصول إلى sessionStorage
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      try {
        const item = window.sessionStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading sessionStorage key "${key}":`, error)
      }
    }
  }, [key, isClient])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (isClient) {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
