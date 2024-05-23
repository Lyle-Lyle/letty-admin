import type { FC } from 'react'
import { useState, useEffect, useRef } from 'react'

type CountDownProp = {
  value: number
  prefix?: string
  suffix?: string
  onFinish?: () => void
}

const CountDown: FC<CountDownProp> = ({ value, prefix, suffix, onFinish }) => {
  const [count, setCount] = useState(value)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (count === 0) {
      clearInterval(timerRef.current)
      onFinish && onFinish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return (
    <>
      {prefix}
      {count}
      {suffix}
    </>
  )
}

export default CountDown
