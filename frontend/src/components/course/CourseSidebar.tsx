import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Circle, PlayCircle, FileText, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/animated';

interface RequiredQuizInfo {
  id: number;
  title: string;
  passing_score: number;
}

interface Lesson {
  id: number;
  title: string;
  video_type: 'none' | 'youtube' | 'vimeo';
  video_id: string | null;
  order: number;
  required_quiz?: number | null;
  required_quiz_info?: RequiredQuizInfo | null;
}

interface LessonWithProgress extends Lesson {
  is_completed?: boolean;
}

interface Unit {
  id: number;
  title: string;
  order: number;
  lessons: LessonWithProgress[];
}

interface CourseSidebarProps {
  units: Unit[];
  currentLessonId: number | null;
  onLessonSelect: (lessonId: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
}

export function CourseSidebar({
  units,
  currentLessonId,
  onLessonSelect,
  isCollapsed,
  onToggleCollapse,
  progressPercentage,
  completedCount,
  totalCount,
}: CourseSidebarProps) {
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  // Auto-expand unit containing current lesson
  useEffect(() => {
    if (currentLessonId) {
      const unitWithLesson = units.find(unit =>
        unit.lessons.some(lesson => lesson.id === currentLessonId)
      );
      if (unitWithLesson && !expandedUnits.includes(unitWithLesson.id)) {
        setExpandedUnits(prev => [...prev, unitWithLesson.id]);
      }
    }
  }, [currentLessonId, units]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId)
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const getUnitProgress = (unit: Unit) => {
    const completed = unit.lessons.filter(l => l.is_completed).length;
    return { completed, total: unit.lessons.length };
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          className="p-2 hover:bg-purple-500/20 rounded-md mb-4 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4 text-purple-400" />
        </motion.button>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-2 bg-muted rounded-full h-32 relative overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-purple-400 mt-2 -rotate-90 whitespace-nowrap origin-center font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[380px] bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">
            <GradientText gradient="gaming" animate={false}>Course Content</GradientText>
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollapse}
            className="p-1 hover:bg-purple-500/20 rounded transition-colors"
            title="Collapse sidebar"
          >
            <ChevronRight className="h-4 w-4 rotate-180 text-purple-400" />
          </motion.button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {totalCount} complete (<span className="text-purple-400 font-medium">{Math.round(progressPercentage)}%</span>)
          </p>
        </div>
      </div>

      {/* Units list */}
      <div className="flex-1 overflow-y-auto">
        {units.map((unit, unitIndex) => {
          const isExpanded = expandedUnits.includes(unit.id);
          const { completed, total } = getUnitProgress(unit);
          const isUnitComplete = completed === total && total > 0;

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: unitIndex * 0.05 }}
              className="border-b border-zinc-800"
            >
              {/* Unit header */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-500/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-left">
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-purple-400" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-sm">{unit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className={isUnitComplete ? 'text-green-400' : 'text-purple-400'}>{completed}</span>/{total} lessons
                    </p>
                  </div>
                </div>
                {isUnitComplete && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </button>

              {/* Lessons list */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-900"
                >
                  {unit.lessons.map((lesson, lessonIndex) => {
                    const isActive = lesson.id === currentLessonId;
                    const hasVideo = lesson.video_type !== 'none' && lesson.video_id;

                    return (
                      <motion.button
                        key={lesson.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: lessonIndex * 0.03 }}
                        onClick={() => onLessonSelect(lesson.id)}
                        className={cn(
                          "w-full px-4 py-2 flex items-center gap-3 text-left transition-all",
                          isActive
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border-l-2 border-purple-500"
                            : "hover:bg-purple-500/10 border-l-2 border-transparent"
                        )}
                      >
                        {/* Completion icon */}
                        <div className="flex-shrink-0">
                          {lesson.is_completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className={cn("h-4 w-4", isActive ? "text-purple-400" : "text-muted-foreground")} />
                          )}
                        </div>

                        {/* Content type icon */}
                        <div className="flex-shrink-0">
                          {hasVideo ? (
                            <PlayCircle className={cn("h-4 w-4", isActive ? "text-pink-400" : "text-muted-foreground")} />
                          ) : (
                            <FileText className={cn("h-4 w-4", isActive ? "text-pink-400" : "text-muted-foreground")} />
                          )}
                        </div>

                        {/* Lesson title */}
                        <span
                          className={cn(
                            "text-sm flex-1 truncate",
                            isActive ? "font-medium text-foreground" : "",
                            lesson.is_completed && !isActive ? "text-muted-foreground" : ""
                          )}
                        >
                          {lesson.title}
                        </span>

                        {/* Quiz requirement indicator */}
                        {lesson.required_quiz_info && !lesson.is_completed && (
                          <span title={`Quiz required: ${lesson.required_quiz_info.title}`}>
                            <FileQuestion className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
