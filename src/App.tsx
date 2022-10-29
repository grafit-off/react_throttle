import { useCallback, useEffect, useState } from 'react';
import 'bulma';

const throttle = (func: (arg: any) => any, delay: number) => {
  let isThrottled = false;

  return (arg: any) => {
    if (isThrottled) {
      return;
    }

    func(arg);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, delay);
  }
}

const App = () => {
  const [realtimePos, setRealtimePos] = useState({ x: 0, y: 0 });
  const [throttledPos, setThrottledPos] = useState({ x: 0, y: 0 });

  const onThrottledMouseMove = useCallback(throttle((pos) => setThrottledPos(pos), 1000), []);

  function realtimeMoveListener(this: Window, event: MouseEvent): void {
    setRealtimePos({ x: event.clientX, y: event.clientY });
  }

  function throttledMoveListener(this: Window, event: MouseEvent): void {
    onThrottledMouseMove({ x: event.clientX, y: event.clientY });
  }

  useEffect(() => {
    window.addEventListener('mousemove', realtimeMoveListener);
    window.addEventListener('mousemove', throttledMoveListener);

    return () => {
      window.removeEventListener('mousemove', realtimeMoveListener);
      window.removeEventListener('mousemove', throttledMoveListener);
    }
  });

  return (
    <section className="hero is-danger is-fullheight">
      <div className="hero-body">
        <div>
          <h1 className="title is-1">Throttle</h1>
          <p className="block is-size-3">
            {`Realtime position: X:${realtimePos.x} Y:${realtimePos.y}`}
          </p>
          <p className="block is-size-3">
            {`Throttle position: X:${throttledPos.x} Y:${throttledPos.y}`}
          </p>
        </div>
      </div>
    </section>
  );
}

export default App;
