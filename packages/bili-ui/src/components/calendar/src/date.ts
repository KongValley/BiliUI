const pad = (value: number): string => String(value).padStart(2, '0')

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Parses `YYYY-MM-DD` into a local Date, returning null for invalid input. */
export function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null
  }
  return date
}

export interface CalendarCell {
  key: string
  date: Date
  day: number
  outside: boolean
  today: boolean
  selected: boolean
  disabled: boolean
}

export interface MonthCellsOptions {
  year: number
  /** 0-based month. */
  month: number
  firstDayOfWeek: number
  todayKey: string
  selectedKey: string
  disabledDate?: (date: Date) => boolean
}

/** Builds a fixed 6×7 grid so the calendar height never jumps between months. */
export function buildMonthCells(options: MonthCellsOptions): CalendarCell[] {
  const { year, month, firstDayOfWeek, todayKey, selectedKey, disabledDate } = options
  const first = new Date(year, month, 1)
  const offset = (first.getDay() - firstDayOfWeek + 7) % 7
  const start = new Date(year, month, 1 - offset)
  const cells: CalendarCell[] = []

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    const key = formatDate(date)
    cells.push({
      key,
      date,
      day: date.getDate(),
      outside: date.getMonth() !== month,
      today: key === todayKey,
      selected: key === selectedKey,
      disabled: disabledDate ? disabledDate(date) : false
    })
  }

  return cells
}
