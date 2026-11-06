'use client';

import { useEffect, useState } from 'react';

type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeUntilNextMonday(): TimeRemaining {
  const now = new Date();
  const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
  const nextMonday = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMonday
  );
  const secondsRemaining = Math.max(0, Math.floor((nextMonday - now.getTime()) / 1000));

  return {
    days: Math.floor(secondsRemaining / 86_400),
    hours: Math.floor((secondsRemaining % 86_400) / 3_600),
    minutes: Math.floor((secondsRemaining % 3_600) / 60),
    seconds: secondsRemaining % 60,
  };
}

export function WeeklyCountdown() {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getTimeUntilNextMonday());
    update();
    const intervalId = window.setInterval(update, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const units: { label: string; value: number | undefined }[] = [
    { label: 'Days', value: remaining?.days },
    { label: 'Hrs', value: remaining?.hours },
    { label: 'Mins', value: remaining?.minutes },
    { label: 'Secs', value: remaining?.seconds },
  ];

  return (
    <div className="mb-5 flex items-center gap-2" aria-label="Time until the next weekly refresh">
      {units.map((unit) => (
        <div key={unit.label} className="min-w-[48px] rounded-lg bg-[#161824] px-2.5 py-2 text-center text-white sm:min-w-[54px]">
          <span className="block text-base font-black leading-none tabular-nums">
            {unit.value === undefined ? '--' : String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase text-neutral-400">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
