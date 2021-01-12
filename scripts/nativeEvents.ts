import React from 'react';

type ClickEvent = 'prevent' | 'stop';

const clickHandlers: Record<ClickEvent, (ev: React.MouseEvent) => void> = {
  'prevent': (e) => e.preventDefault(),
  'stop': (e) => e.stopPropagation()
};

export function clickWithEvent(ev: React.MouseEvent, clickEvents: ClickEvent[], fn: () => void) {
  clickEvents.forEach(c => clickHandlers[c](ev));
  fn();
}