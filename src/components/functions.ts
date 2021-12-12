import gsap from 'gsap';

export const animate = (
  target: gsap.TweenTarget,
  values: any,
  duration?: number,
  ease?: string,
  onComplete?: () => void,
  onUpdate?: () => void
) => {
  gsap.to(target, {
    ...values,
    duration: duration,
    ease: ease,
    onUpdate: onUpdate,
    onComplete: onComplete,
  });
};
