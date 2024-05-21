import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';

type CountDownProp = {
  value: number;
  prefix?: string;
  suffix?: string;
  onFinish?: () => void;
};

const CountDown: FC<CountDownProp> = ({ value, prefix, suffix, onFinish }) => {
  const [count, setCount] = useState(value);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // 每隔1秒，count 值自减
      setCount((prev) => prev - 1);
    }, 1000);

    // 清理函数，在组件销毁时清除定时器
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (count === 0) {
      // 倒计时正常结束时，清除定时器
      clearInterval(timerRef.current);
      // 执行用户传递进来的回调函数
      onFinish && onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <>
      {prefix}
      {count}
      {suffix}
    </>
  );
};

export default CountDown;
