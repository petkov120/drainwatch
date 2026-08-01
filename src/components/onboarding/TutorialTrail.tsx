import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import { tutorialSteps, type TutorialPlacement } from '../../data/tutorial-steps'

const SPOTLIGHT_PAD = 8
const VIEWPORT_PAD = 16

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export function TutorialTrail() {
  const { stepIndex, totalSteps, nextStep, prevStep, skipOnboarding, finishTrail } =
    useOnboarding()
  const step = tutorialSteps[stepIndex]
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({})
  const placement = step.placement ?? 'bottom'

  const measureTarget = useCallback(() => {
    if (!step.target) {
      setTargetRect(null)
      setCardStyle({})
      return
    }

    const el = findVisibleTourTarget(step.target)
    if (!el) {
      setTargetRect(null)
      setCardStyle({})
      return
    }

    const rect = el.getBoundingClientRect()
    const spotlight: Rect = {
      top: rect.top - SPOTLIGHT_PAD,
      left: rect.left - SPOTLIGHT_PAD,
      width: rect.width + SPOTLIGHT_PAD * 2,
      height: rect.height + SPOTLIGHT_PAD * 2,
    }
    setTargetRect(spotlight)
    setCardStyle(computeCardStyle(spotlight, placement))
  }, [step.target, placement])

  useLayoutEffect(() => {
    measureTarget()
    const retry = window.setTimeout(measureTarget, 120)
    const retry2 = window.setTimeout(measureTarget, 400)
    return () => {
      clearTimeout(retry)
      clearTimeout(retry2)
    }
  }, [measureTarget, stepIndex, step.route])

  useEffect(() => {
    window.addEventListener('resize', measureTarget)
    window.addEventListener('scroll', measureTarget, true)
    return () => {
      window.removeEventListener('resize', measureTarget)
      window.removeEventListener('scroll', measureTarget, true)
    }
  }, [measureTarget])

  const isLast = stepIndex === totalSteps - 1
  const isCenter = !step.target || placement === 'center'

  return createPortal(
    <div className="fw-tutorial-root" role="presentation">
      {isCenter ? (
        <div className="fw-tutorial-backdrop fw-tutorial-backdrop--center" />
      ) : targetRect ? (
        <div
          className="fw-tutorial-spotlight"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
          aria-hidden
        />
      ) : (
        <div className="fw-tutorial-backdrop" />
      )}

      <div
        className={`fw-tutorial-card fw-panel-enter ${isCenter ? 'fw-tutorial-card--center' : ''}`}
        style={isCenter ? undefined : cardStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-step-title"
      >
        <div className="fw-tutorial-progress" aria-hidden>
          {tutorialSteps.map((s, i) => (
            <span
              key={s.id}
              className={`fw-tutorial-progress-dot ${i <= stepIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>

        <p className="fw-type-caption text-[var(--color-fw-text-secondary)] mb-1">
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <h3 id="tutorial-step-title" className="fw-type-title">
          {step.title}
        </h3>
        <p className="fw-type-body text-[var(--color-fw-text-secondary)] mt-2">{step.body}</p>

        <div className="flex items-center justify-between gap-3 mt-5">
          <button
            type="button"
            className="fw-tutorial-text-btn"
            onClick={skipOnboarding}
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button type="button" className="fw-btn-secondary" onClick={prevStep}>
                Back
              </button>
            )}
            <button
              type="button"
              className="fw-btn-primary"
              onClick={isLast ? finishTrail : nextStep}
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function computeCardStyle(rect: Rect, placement: TutorialPlacement): React.CSSProperties {
  const cardW = 320
  const cardH = 220
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (placement === 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: cardW,
    }
  }

  let top = rect.top + rect.height + 12
  let left = rect.left + rect.width / 2 - cardW / 2

  if (placement === 'top') {
    top = rect.top - cardH - 12
  } else if (placement === 'left') {
    top = rect.top + rect.height / 2 - cardH / 2
    left = rect.left - cardW - 12
  } else if (placement === 'right') {
    top = rect.top + rect.height / 2 - cardH / 2
    left = rect.left + rect.width + 12
  }

  left = Math.max(VIEWPORT_PAD, Math.min(left, vw - cardW - VIEWPORT_PAD))
  top = Math.max(VIEWPORT_PAD, Math.min(top, vh - cardH - VIEWPORT_PAD))

  return { top, left, width: cardW, position: 'fixed' as const }
}

function findVisibleTourTarget(id: string): Element | null {
  const els = document.querySelectorAll(`[data-tour="${id}"]`)
  for (const el of els) {
    const style = window.getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') continue
    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) return el
  }
  return null
}
