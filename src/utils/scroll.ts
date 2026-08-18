/**
 * High-performance fast & smooth scroll utility with cubic-bezier / quart easing.
 * Provides snappy, cinematic transitions between sections without browser lag.
 */
export const fastSmoothScrollTo = (targetY: number, duration: number = 420) => {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  
  if (Math.abs(distance) < 5) return;

  let startTime: number | null = null;
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const step = (currentTime: number) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutQuart(progress);

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

export const scrollToElementFast = (elementId: string, offset: number = 0, duration: number = 420) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
  fastSmoothScrollTo(top, duration);
};
