import { X, Pencil, Trash2, Bell, FileText, Clock, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CalendarEvent } from '@/types';

interface EventDetailPopupProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function EventDetailPopup({
  event,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: EventDetailPopupProps) {
  const formatTime = (time: string | null) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      case 'purple': return 'bg-purple-500';
      case 'blue':
      default: return 'bg-blue-500';
    }
  };

  const isReminder = event.type === 'reminder';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Color bar at top */}
        <div className={`h-2 ${getColorClass(event.color)}`} />

        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColorClass(event.color)}/20`}>
              {isReminder ? (
                <Bell className={`h-5 w-5 text-${event.color}-400`} />
              ) : (
                <FileText className={`h-5 w-5 text-${event.color}-400`} />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {isReminder ? 'Reminder' : 'Assignment'}
              </p>
              <h3 className="text-lg font-semibold">{event.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Details */}
        <div className="px-4 pb-4 space-y-3">
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.date)}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(event.time)}</span>
            </div>
          )}

          {/* Course */}
          {event.course_code && (
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{event.course_code}</span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {isReminder && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              disabled={isDeleting}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
          </div>
        )}

        {/* Assignment link */}
        {!isReminder && event.url && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = event.url!}
            >
              View Submissions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
