import { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { courseService, type InstructorCourse } from '@/services/courses';

interface AddReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  courses: InstructorCourse[];
  onSuccess: () => void;
}

const COLORS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];

export function AddReminderModal({
  open,
  onOpenChange,
  defaultDate,
  courses,
  onSuccess,
}: AddReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2026);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [color, setColor] = useState('blue');
  const [courseId, setCourseId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get days in the selected month
  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Years range (current year to +2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setHour(null);
      setMinute('00');
      setAmpm('AM');
      setColor('blue');
      setCourseId('');
      setError('');

      // Set date from defaultDate or today
      const dateToUse = defaultDate ? new Date(defaultDate + 'T00:00:00') : new Date();
      setMonth(dateToUse.getMonth());
      setDay(dateToUse.getDate());
      setYear(dateToUse.getFullYear());
    }
  }, [open, defaultDate]);

  // Adjust day if it exceeds days in month
  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [month, year, daysInMonth, day]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a title for your reminder');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Format date as YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Format time as HH:MM (24-hour) if hour is selected
    let timeStr: string | undefined;
    if (hour !== null) {
      let hour24 = hour;
      if (ampm === 'PM' && hour !== 12) hour24 = hour + 12;
      if (ampm === 'AM' && hour === 12) hour24 = 0;
      timeStr = `${String(hour24).padStart(2, '0')}:${minute}`;
    }

    try {
      await courseService.createReminder({
        title: trimmedTitle,
        description: description.trim(),
        date: dateStr,
        time: timeStr,
        color,
        course: courseId ? parseInt(courseId) : undefined,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error('Failed to create reminder:', err);
      setError('Failed to create reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format the selected date for display
  const formatDateDisplay = () => {
    const d = new Date(year, month, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!open) return null;

  const selectClass = "px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e]/50 appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#22c55e]" />
            <h2 className="text-lg font-semibold">Add Reminder</h2>
          </div>
          <button
            onClick={() => !isSubmitting && onOpenChange(false)}
            className="p-1 rounded hover:bg-muted transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Date Display */}
          <div className="text-sm text-muted-foreground">
            Adding reminder for: <span className="text-foreground font-medium">{formatDateDisplay()}</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Grade assignments, Parent meeting..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e]/50"
              autoFocus
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e]/50 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Date Dropdowns */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Date <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value))}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting}
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Time Dropdowns */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Time <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  value={hour ?? ''}
                  onChange={(e) => setHour(e.target.value ? parseInt(e.target.value) : null)}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting}
                >
                  <option value="">Hour</option>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting || hour === null}
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>:{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={ampm}
                  onChange={(e) => setAmpm(e.target.value as 'AM' | 'PM')}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting || hour === null}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Course */}
          {courses.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Link to Course <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="relative">
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className={selectClass + " w-full pr-8"}
                  disabled={isSubmitting}
                >
                  <option value="">No course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          )}

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  disabled={isSubmitting}
                  className={`w-8 h-8 rounded-full transition-all ${c.class} ${
                    color === c.value
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-white scale-110'
                      : 'opacity-50 hover:opacity-75 hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="neon"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Reminder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
