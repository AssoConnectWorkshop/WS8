'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Check, Users, Clock, Euro, RefreshCw, X, CheckSquare,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ActivityType = 'class' | 'court' | 'field'
type Recurrence = 'daily' | 'weekly' | 'monthly'
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
type RegistrationStatus = 'registered' | 'checked_in' | 'cancelled'

interface Activity {
  id: string
  name: string
  type: ActivityType
  days: DayOfWeek[]
  startTime: string
  endTime: string
  recurrence: Recurrence
  startDate: string
  endDate: string
  spots: number
  price: number
  bookingOpens: number
  cancellationDeadline: number
  allowRecurring: boolean
}

interface Session {
  id: string
  activityId: string
  date: string // YYYY-MM-DD
}

interface Registration {
  id: string
  sessionId: string
  memberName: string
  registeredAt: string
  status: RegistrationStatus
}

interface FormState {
  name: string
  type: ActivityType
  days: DayOfWeek[]
  startTime: string
  endTime: string
  recurrence: Recurrence
  startDate: string
  endDate: string
  spots: string
  price: string
  bookingOpens: number
  cancellationDeadline: number
  allowRecurring: boolean
  step: 'form' | 'confirmation'
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}
const DAY_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const JS_DAY_TO_DOW: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const TYPE_COLORS: Record<ActivityType, string> = {
  class: 'bg-indigo-500',
  court: 'bg-emerald-500',
  field: 'bg-amber-500',
}
const TYPE_LIGHT: Record<ActivityType, string> = {
  class: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  court: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  field: 'bg-amber-100 text-amber-800 border-amber-200',
}
const TYPE_LABELS: Record<ActivityType, string> = { class: 'Class', court: 'Court', field: 'Field' }

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1', name: 'Friday Yoga', type: 'class',
    days: ['friday'], startTime: '10:00', endTime: '11:00',
    recurrence: 'weekly', startDate: '2025-09-05', endDate: '2026-06-26',
    spots: 12, price: 8, bookingOpens: 7, cancellationDeadline: 24, allowRecurring: true,
  },
  {
    id: '2', name: 'Tennis Court A', type: 'court',
    days: ['monday', 'wednesday', 'friday'], startTime: '09:00', endTime: '10:00',
    recurrence: 'weekly', startDate: '2025-09-01', endDate: '2026-06-30',
    spots: 4, price: 5, bookingOpens: 3, cancellationDeadline: 12, allowRecurring: false,
  },
]

// ─── Session generation ───────────────────────────────────────────────────────

function generateSessions(activity: Activity): Session[] {
  const sessions: Session[] = []
  const start = new Date(activity.startDate + 'T00:00:00')
  const end = new Date(activity.endDate + 'T00:00:00')
  const cur = new Date(start)
  let idx = 0

  if (activity.recurrence === 'daily') {
    while (cur <= end) {
      sessions.push({ id: `${activity.id}-${idx++}`, activityId: activity.id, date: toDateStr(cur) })
      cur.setDate(cur.getDate() + 1)
    }
  } else if (activity.recurrence === 'weekly') {
    while (cur <= end) {
      const dow = JS_DAY_TO_DOW[cur.getDay()]
      if (activity.days.includes(dow)) {
        sessions.push({ id: `${activity.id}-${idx++}`, activityId: activity.id, date: toDateStr(cur) })
      }
      cur.setDate(cur.getDate() + 1)
    }
  } else {
    // monthly: emit all matching day-of-week occurrences
    while (cur <= end) {
      const dow = JS_DAY_TO_DOW[cur.getDay()]
      if (activity.days.includes(dow)) {
        sessions.push({ id: `${activity.id}-${idx++}`, activityId: activity.id, date: toDateStr(cur) })
      }
      cur.setDate(cur.getDate() + 1)
    }
  }
  return sessions
}

function countSessions(days: DayOfWeek[], recurrence: Recurrence, startDate: string, endDate: string): number {
  if (!startDate || !endDate || (recurrence !== 'daily' && days.length === 0)) return 0
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  if (end < start) return 0
  if (recurrence === 'daily') {
    return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1
  }
  if (recurrence === 'weekly') {
    let count = 0
    const cur = new Date(start)
    while (cur <= end) {
      if (days.includes(JS_DAY_TO_DOW[cur.getDay()])) count++
      cur.setDate(cur.getDate() + 1)
    }
    return count
  }
  // monthly
  if (days.length === 0) return 0
  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    if (days.includes(JS_DAY_TO_DOW[cur.getDay()])) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

// ─── Mock registrations ───────────────────────────────────────────────────────

function makeMockRegistrations(sessions: Session[], activities: Activity[]): Registration[] {
  const regs: Registration[] = []
  const today = toDateStr(new Date())
  const MEMBERS = ['Alice Martin', 'Bob Dupont', 'Claire Lefèvre', 'David Moreau', 'Emma Bernard',
    'François Petit', 'Gisèle Rousseau', 'Hugo Simon', 'Isabelle Laurent', 'Jules Thomas']

  let rid = 0
  const actMap = new Map(activities.map(a => [a.id, a]))

  const upcoming = sessions
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))

  // group by activity, take first 3 per activity
  const byActivity = new Map<string, Session[]>()
  for (const s of upcoming) {
    if (!byActivity.has(s.activityId)) byActivity.set(s.activityId, [])
    const arr = byActivity.get(s.activityId)!
    if (arr.length < 3) arr.push(s)
  }

  for (const [actId, slist] of byActivity) {
    const act = actMap.get(actId)!
    const memberCount = Math.min(act.spots, Math.floor(act.spots * 0.6) + 1)
    for (const session of slist) {
      for (let i = 0; i < memberCount; i++) {
        regs.push({
          id: `r-${rid++}`,
          sessionId: session.id,
          memberName: MEMBERS[i % MEMBERS.length],
          registeredAt: '2025-09-01T10:00:00Z',
          status: i < 2 ? 'checked_in' : 'registered',
        })
      }
    }
  }

  // past sessions — add some history for attendance tab
  const past = sessions
    .filter(s => s.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  for (const session of past) {
    const act = actMap.get(session.activityId)!
    const memberCount = Math.min(act.spots, 3)
    for (let i = 0; i < memberCount; i++) {
      regs.push({
        id: `r-${rid++}`,
        sessionId: session.id,
        memberName: MEMBERS[i % MEMBERS.length],
        registeredAt: '2025-09-01T10:00:00Z',
        status: Math.random() > 0.25 ? 'checked_in' : 'registered',
      })
    }
  }

  return regs
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function startOfWeek(d: Date): Date {
  const day = d.getDay()
  const diff = (day + 6) % 7 // Mon=0
  return addDays(d, -diff)
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function formatWeekRange(d: Date): string {
  const mon = startOfWeek(d)
  const sun = addDays(mon, 6)
  return `${mon.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${sun.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

const HOUR_SLOTS = Array.from({ length: 13 }, (_, i) => i + 8) // 08–20

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
}

// ─── Creation form ────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = {
  name: '', type: 'class', days: [], startTime: '', endTime: '',
  recurrence: 'weekly', startDate: '', endDate: '', spots: '', price: '',
  bookingOpens: 7, cancellationDeadline: 24, allowRecurring: false, step: 'form',
}

function CreateForm({ onCreated }: { onCreated: (a: Activity) => void }) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [rulesOpen, setRulesOpen] = useState(false)

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }, [])

  const sessionCount = useMemo(
    () => countSessions(form.days, form.recurrence, form.startDate, form.endDate),
    [form.days, form.recurrence, form.startDate, form.endDate]
  )

  const toggleDay = (d: DayOfWeek) => {
    set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d])
  }

  const validate = (): boolean => {
    const e: Partial<Record<string, string>> = {}
    if (!form.name.trim()) e.name = 'Activity name is required'
    if (form.recurrence !== 'daily' && form.days.length === 0) e.days = 'Select at least one day'
    if (!form.startTime) e.startTime = 'Required'
    if (!form.endTime) e.endTime = 'Required'
    if (form.startTime && form.endTime && form.endTime <= form.startTime) e.endTime = 'End must be after start'
    if (!form.startDate) e.startDate = 'Required'
    if (!form.endDate) e.endDate = 'Required'
    if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = 'End must be after start'
    if (!form.spots || isNaN(Number(form.spots)) || Number(form.spots) < 1) e.spots = 'Enter a valid number ≥ 1'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) set('step', 'confirmation')
  }

  const handleCancel = () => {
    setForm(INITIAL_FORM)
    setErrors({})
  }

  const handleCreate = () => {
    const activity: Activity = {
      id: Date.now().toString(),
      name: form.name, type: form.type, days: form.days,
      startTime: form.startTime, endTime: form.endTime,
      recurrence: form.recurrence, startDate: form.startDate, endDate: form.endDate,
      spots: Number(form.spots), price: Number(form.price) || 0,
      bookingOpens: form.bookingOpens, cancellationDeadline: form.cancellationDeadline,
      allowRecurring: form.allowRecurring,
    }
    onCreated(activity)
  }

  const daysLabel = form.days.map(d => DAY_LABELS[d]).join(', ') || '—'

  if (form.step === 'confirmation') {
    return (
      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </span>
            <div>
              <h2 className="text-xl font-bold">{form.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_LIGHT[form.type]}`}>{TYPE_LABELS[form.type]}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <Row icon={<CalendarDays className="w-4 h-4" />} label={`Every ${daysLabel} at ${form.startTime}–${form.endTime}`} />
            <Row icon={<RefreshCw className="w-4 h-4" />} label={`${capitalize(form.recurrence)} · ${formatDate(form.startDate)} → ${formatDate(form.endDate)}`} />
            <Row icon={<Users className="w-4 h-4" />} label={`${sessionCount} sessions · ${form.spots} spots each`} />
            <Row icon={<Euro className="w-4 h-4" />} label={Number(form.price) > 0 ? `€${form.price} per session` : 'Free'} />
            <Row icon={<Clock className="w-4 h-4" />} label={`Booking opens ${form.bookingOpens}d before · Cancellation up to ${form.cancellationDeadline}h before`} />
            <Row icon={<RefreshCw className="w-4 h-4" />} label={`Recurring subscriptions: ${form.allowRecurring ? 'Yes' : 'No'}`} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleCancel} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">
              Create another
            </button>
            <button onClick={handleCreate} className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              Go to calendar →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-7">
        <h2 className="text-xl font-bold text-gray-900">New activity</h2>

        {/* Basics */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Activity</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Activity name <span className="text-red-500">*</span></label>
            <input
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="e.g. Friday Yoga"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Activity type</label>
            <div className="flex gap-2">
              {(['class', 'court', 'field'] as ActivityType[]).map(t => (
                <button key={t} onClick={() => set('type', t)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${form.type === t ? `${TYPE_LIGHT[t]} border-current` : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Schedule</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Day(s) of week {form.recurrence !== 'daily' && <span className="text-red-500">*</span>}</label>
            <div className="flex gap-1.5 flex-wrap">
              {DAY_ORDER.map(d => (
                <button key={d} onClick={() => toggleDay(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${form.days.includes(d) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
            {errors.days && <p className="text-xs text-red-500">{errors.days}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Start time <span className="text-red-500">*</span></label>
              <input type="time" className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.startTime ? 'border-red-400' : 'border-gray-200'}`}
                value={form.startTime} onChange={e => set('startTime', e.target.value)} />
              {errors.startTime && <p className="text-xs text-red-500">{errors.startTime}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">End time <span className="text-red-500">*</span></label>
              <input type="time" className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.endTime ? 'border-red-400' : 'border-gray-200'}`}
                value={form.endTime} onChange={e => set('endTime', e.target.value)} />
              {errors.endTime && <p className="text-xs text-red-500">{errors.endTime}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Recurrence</label>
            <select className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.recurrence} onChange={e => set('recurrence', e.target.value as Recurrence)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </section>

        {/* Period */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Planning period</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Start date <span className="text-red-500">*</span></label>
              <input type="date" className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.startDate ? 'border-red-400' : 'border-gray-200'}`}
                value={form.startDate} onChange={e => set('startDate', e.target.value)} />
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">End date <span className="text-red-500">*</span></label>
              <input type="date" className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.endDate ? 'border-red-400' : 'border-gray-200'}`}
                value={form.endDate} onChange={e => set('endDate', e.target.value)} />
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>
          {(sessionCount > 0 || (form.startDate && form.endDate)) && (
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold w-fit border border-indigo-100">
              <CalendarDays className="w-4 h-4" />
              {sessionCount > 0 ? `→ ${sessionCount} sessions will be generated` : '→ 0 sessions (check days / dates)'}
            </div>
          )}
        </section>

        {/* Capacity */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Capacity</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Spots per session <span className="text-red-500">*</span></label>
              <input type="number" min={1} className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.spots ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="e.g. 12" value={form.spots} onChange={e => set('spots', e.target.value)} />
              {errors.spots && <p className="text-xs text-red-500">{errors.spots}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Price per session (€)</label>
              <input type="number" min={0} step={0.5} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="0 = free" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Booking rules */}
        <section className="flex flex-col gap-0">
          <button onClick={() => setRulesOpen(o => !o)}
            className="flex items-center justify-between py-3 text-sm font-semibold text-gray-700 border-t border-gray-100 hover:text-gray-900 transition">
            <span>Booking rules</span>
            {rulesOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {rulesOpen && (
            <div className="flex flex-col gap-4 pt-3 pb-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Booking opens</label>
                  <select className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm" value={form.bookingOpens} onChange={e => set('bookingOpens', Number(e.target.value))}>
                    {[1, 3, 7, 14, 30].map(n => <option key={n} value={n}>{n} days before</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Cancellation deadline</label>
                  <select className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm" value={form.cancellationDeadline} onChange={e => set('cancellationDeadline', Number(e.target.value))}>
                    {[2, 12, 24, 48, 72].map(n => <option key={n} value={n}>{n}h before</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-700">Allow recurring subscriptions</span>
                <button onClick={() => set('allowRecurring', !form.allowRecurring)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.allowRecurring ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.allowRecurring ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button onClick={handleCancel} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
            Finish
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

// ─── Session detail panel ─────────────────────────────────────────────────────

function SessionPanel({
  session, activity, registrations, allSessions, allRegistrations, onClose, onCheckIn, onCheckInAll,
}: {
  session: Session
  activity: Activity
  registrations: Registration[]
  allSessions: Session[]
  allRegistrations: Registration[]
  onClose: () => void
  onCheckIn: (regId: string) => void
  onCheckInAll: (sessionId: string) => void
}) {
  const [tab, setTab] = useState<'registrations' | 'history'>('registrations')
  const today = toDateStr(new Date())

  // History: past sessions of same activity
  const pastSessions = allSessions
    .filter(s => s.activityId === activity.id && s.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)

  const historyRows = pastSessions.map(s => {
    const regs = allRegistrations.filter(r => r.sessionId === s.id)
    const registered = regs.filter(r => r.status !== 'cancelled').length
    const checkedIn = regs.filter(r => r.status === 'checked_in').length
    return { session: s, registered, checkedIn, absent: registered - checkedIn }
  })

  const avgAttendance = historyRows.length > 0
    ? Math.round(historyRows.reduce((acc, r) => acc + (r.registered > 0 ? r.checkedIn / r.registered : 0), 0) / historyRows.length * 100)
    : 0

  const filled = registrations.filter(r => r.status !== 'cancelled').length

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`${TYPE_COLORS[activity.type]} p-5 flex items-start justify-between`}>
          <div className="text-white">
            <h3 className="text-lg font-bold">{activity.name}</h3>
            <p className="text-sm opacity-90 mt-1">{formatDate(session.date)}</p>
            <p className="text-sm opacity-90">{activity.startTime} – {activity.endTime}</p>
            <p className="text-sm font-semibold mt-1 opacity-95">{filled}/{activity.spots} spots filled</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(['registrations', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition ${tab === t ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'registrations' ? 'Registrations' : 'Attendance history'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'registrations' && (
            <div className="flex flex-col gap-3">
              {registrations.length > 0 && (
                <button onClick={() => onCheckInAll(session.id)}
                  className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition py-1">
                  <CheckSquare className="w-4 h-4" /> Check in all
                </button>
              )}
              {registrations.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No registrations yet</div>
              ) : (
                registrations.map(reg => (
                  <div key={reg.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{reg.memberName}</p>
                      <p className="text-xs text-gray-400">{new Date(reg.registeredAt).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reg.status === 'checked_in'
                        ? <Badge className="bg-green-100 text-green-700">Checked in ✓</Badge>
                        : reg.status === 'cancelled'
                          ? <Badge className="bg-gray-100 text-gray-500">Cancelled</Badge>
                          : (
                            <button onClick={() => onCheckIn(reg.id)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium transition">
                              Check in
                            </button>
                          )
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'history' && (
            <div className="flex flex-col gap-3">
              {historyRows.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No past sessions yet</div>
              ) : (
                <>
                  <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-2">
                    <span>Date</span><span className="text-center">Reg.</span><span className="text-center">In</span><span className="text-center">Absent</span>
                  </div>
                  {historyRows.map(({ session: s, registered, checkedIn, absent }) => (
                    <div key={s.id} className="grid grid-cols-4 text-sm px-3 py-2.5 bg-gray-50 rounded-xl items-center">
                      <span className="text-gray-700 text-xs">{formatDate(s.date)}</span>
                      <span className="text-center text-gray-600">{registered}</span>
                      <span className="text-center text-green-600 font-medium">{checkedIn}</span>
                      <span className="text-center text-red-400">{absent}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-3 bg-indigo-50 rounded-xl mt-2">
                    <span className="text-sm font-semibold text-indigo-700">Avg. attendance rate</span>
                    <span className="text-lg font-bold text-indigo-700">{avgAttendance}%</span>
                  </div>
                  {historyRows.length === 1 && (
                    <p className="text-xs text-gray-400 text-center">Not enough history yet for reliable averages</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Calendar: Week view ──────────────────────────────────────────────────────

function WeekView({
  currentDate, sessions, activities, registrations, activityFilter, onSelectSession,
}: {
  currentDate: Date
  sessions: Session[]
  activities: Activity[]
  registrations: Registration[]
  activityFilter: string
  onSelectSession: (id: string) => void
}) {
  const mon = startOfWeek(currentDate)
  const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i))
  const today = toDateStr(new Date())

  const actMap = new Map(activities.map(a => [a.id, a]))

  const weekDates = new Set(days.map(toDateStr))
  const visible = sessions.filter(s => weekDates.has(s.date) && (activityFilter === 'all' || s.activityId === activityFilter))

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header row */}
        <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-gray-100">
          <div />
          {days.map((d, i) => (
            <div key={i} className={`text-center py-2 text-sm font-semibold ${toDateStr(d) === today ? 'text-indigo-600' : 'text-gray-500'}`}>
              <div>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</div>
              <div className={`text-lg font-bold ${toDateStr(d) === today ? 'w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto' : ''}`}>
                {d.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {HOUR_SLOTS.map(hour => (
          <div key={hour} className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-gray-50 min-h-[56px]">
            <div className="text-xs text-gray-400 pt-1 pr-2 text-right">{hour}:00</div>
            {days.map((d, di) => {
              const dateStr = toDateStr(d)
              const slotSessions = visible.filter(s => {
                if (s.date !== dateStr) return false
                const act = actMap.get(s.activityId)
                if (!act) return false
                const sh = timeToMinutes(act.startTime) / 60
                return Math.floor(sh) === hour
              })
              return (
                <div key={di} className="border-l border-gray-50 p-0.5 flex flex-col gap-0.5">
                  {slotSessions.map(s => {
                    const act = actMap.get(s.activityId)!
                    const filled = registrations.filter(r => r.sessionId === s.id && r.status !== 'cancelled').length
                    const full = filled >= act.spots
                    return (
                      <button key={s.id} onClick={() => onSelectSession(s.id)}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium transition hover:opacity-90 ${full ? 'bg-gray-200 text-gray-500' : `${TYPE_COLORS[act.type]} text-white`}`}>
                        <div className="font-semibold truncate">{act.name}</div>
                        <div className="opacity-80">{full ? '● Full' : `${act.spots - filled} left`}</div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Calendar: Month view ─────────────────────────────────────────────────────

function MonthView({
  currentDate, sessions, activities, activityFilter, onSelectSession,
}: {
  currentDate: Date
  sessions: Session[]
  activities: Activity[]
  activityFilter: string
  onSelectSession: (id: string) => void
}) {
  const actMap = new Map(activities.map(a => [a.id, a]))
  const today = toDateStr(new Date())

  // Build grid: 6 rows × 7 cols starting from Mon before/on month start
  const firstDay = startOfMonth(currentDate)
  const gridStart = startOfWeek(firstDay)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const month = currentDate.getMonth()

  const visible = sessions.filter(s => activityFilter === 'all' || s.activityId === activityFilter)
  const byDate = new Map<string, Session[]>()
  for (const s of visible) {
    if (!byDate.has(s.date)) byDate.set(s.date, [])
    byDate.get(s.date)!.push(s)
  }

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-gray-100">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dateStr = toDateStr(cell)
          const isMonth = cell.getMonth() === month
          const isToday = dateStr === today
          const daySessions = byDate.get(dateStr) ?? []
          const shown = daySessions.slice(0, 3)
          const rest = daySessions.length - 3

          return (
            <div key={i} className={`min-h-[100px] border-b border-r border-gray-100 p-1.5 ${!isMonth ? 'bg-gray-50' : ''}`}>
              <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : isMonth ? 'text-gray-700' : 'text-gray-300'}`}>
                {cell.getDate()}
              </div>
              {shown.map(s => {
                const act = actMap.get(s.activityId)
                if (!act) return null
                return (
                  <button key={s.id} onClick={() => onSelectSession(s.id)}
                    className={`w-full text-left text-xs px-1.5 py-0.5 rounded mb-0.5 truncate font-medium text-white hover:opacity-80 transition ${TYPE_COLORS[act.type]}`}>
                    {act.startTime} {act.name}
                  </button>
                )
              })}
              {rest > 0 && <div className="text-xs text-indigo-500 font-medium">+{rest} more</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ActivityScheduler() {
  const [view, setView] = useState<'calendar' | 'create'>('calendar')
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activityFilter, setActivityFilter] = useState('all')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES)
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const sessions = MOCK_ACTIVITIES.flatMap(generateSessions)
    return makeMockRegistrations(sessions, MOCK_ACTIVITIES)
  })

  const sessions = useMemo(() => activities.flatMap(generateSessions), [activities])

  const handleCreated = useCallback((activity: Activity) => {
    setActivities(prev => [...prev, activity])
    setView('calendar')
  }, [])

  const navigate = (dir: 1 | -1) => {
    setCurrentDate(d => {
      const n = new Date(d)
      if (calendarMode === 'week') n.setDate(n.getDate() + dir * 7)
      else n.setMonth(n.getMonth() + dir)
      return n
    })
  }

  const label = calendarMode === 'week' ? formatWeekRange(currentDate) : formatMonthYear(currentDate)

  const selectedSession = selectedSessionId ? sessions.find(s => s.id === selectedSessionId) ?? null : null
  const selectedActivity = selectedSession ? activities.find(a => a.id === selectedSession.activityId) ?? null : null
  const sessionRegistrations = selectedSessionId
    ? registrations.filter(r => r.sessionId === selectedSessionId)
    : []

  const handleCheckIn = (regId: string) => {
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'checked_in' } : r))
  }

  const handleCheckInAll = (sessionId: string) => {
    setRegistrations(prev => prev.map(r =>
      r.sessionId === sessionId && r.status === 'registered' ? { ...r, status: 'checked_in' } : r
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
        <h1 className="text-base font-bold text-gray-900 mr-4">Activity Scheduler</h1>
        <nav className="flex gap-1">
          <button onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${view === 'calendar' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <CalendarDays className="w-4 h-4" /> Calendar
          </button>
          <button onClick={() => setView('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${view === 'create' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Plus className="w-4 h-4" /> Create activity
          </button>
        </nav>
      </header>

      {view === 'create' && <CreateForm onCreated={handleCreated} />}

      {view === 'calendar' && (
        <div className="flex flex-col h-[calc(100vh-57px)]">
          {/* Calendar toolbar */}
          <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-gray-700 min-w-[180px] text-center">{label}</span>
              <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="ml-2 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Today
              </button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <select
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={activityFilter}
                onChange={e => setActivityFilter(e.target.value)}
              >
                <option value="all">All activities</option>
                {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {(['week', 'month'] as const).map(m => (
                  <button key={m} onClick={() => setCalendarMode(m)}
                    className={`px-3 py-1.5 text-sm font-medium transition ${calendarMode === m ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {capitalize(m)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-4">
            {activities.map(a => (
              <div key={a.id} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[a.type]}`} />
                <span className="text-xs text-gray-500">{a.name}</span>
              </div>
            ))}
          </div>

          {/* Calendar body */}
          <div className="flex-1 overflow-y-auto bg-white">
            {calendarMode === 'week'
              ? <WeekView currentDate={currentDate} sessions={sessions} activities={activities} registrations={registrations} activityFilter={activityFilter} onSelectSession={setSelectedSessionId} />
              : <MonthView currentDate={currentDate} sessions={sessions} activities={activities} activityFilter={activityFilter} onSelectSession={setSelectedSessionId} />
            }
          </div>
        </div>
      )}

      {/* Session detail panel */}
      {selectedSession && selectedActivity && (
        <SessionPanel
          session={selectedSession}
          activity={selectedActivity}
          registrations={sessionRegistrations}
          allSessions={sessions}
          allRegistrations={registrations}
          onClose={() => setSelectedSessionId(null)}
          onCheckIn={handleCheckIn}
          onCheckInAll={handleCheckInAll}
        />
      )}
    </div>
  )
}
