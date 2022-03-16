import gsap from "gsap";

export const animate = (
  target: gsap.TweenTarget,
  values: any,
  duration?: number,
  ease?: string,
  onComplete?: () => void,
  onUpdate?: () => void,
  onStart?: () => void
) => {
  gsap.to(target, {
    ...values,
    duration: duration,
    ease: ease,
    onComplete: onComplete,
    onUpdate: onUpdate,
    onStart: onStart
  });
};
