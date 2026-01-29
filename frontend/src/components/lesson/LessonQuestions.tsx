import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { courseService } from '@/services/courses';
import type { LessonQuestion, LessonQuestionsStatus } from '@/types';
import { CheckCircle, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonQuestionsProps {
  lessonId: number;
  onStatusChange?: (status: LessonQuestionsStatus) => void;
}

interface AnsweredQuestion {
  questionId: number;
  selectedChoiceId: number;
  isCorrect: boolean;
  correctChoiceId: number | null;
}

export function LessonQuestions({ lessonId, onStatusChange }: LessonQuestionsProps) {
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [status, setStatus] = useState<LessonQuestionsStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<number, AnsweredQuestion>>(new Map());
  const [submittingQuestion, setSubmittingQuestion] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const [questionsData, statusData] = await Promise.all([
        courseService.getLessonQuestions(lessonId),
        courseService.getLessonQuestionsStatus(lessonId)
      ]);
      setQuestions(questionsData);
      setStatus(statusData);
      onStatusChange?.(statusData);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (questionId: number, choiceId: number) => {
    if (answeredQuestions.has(questionId)) return;

    setSubmittingQuestion(questionId);
    try {
      const result = await courseService.answerLessonQuestion(lessonId, questionId, choiceId);

      setAnsweredQuestions(prev => {
        const newMap = new Map(prev);
        newMap.set(questionId, {
          questionId,
          selectedChoiceId: choiceId,
          isCorrect: result.is_correct,
          correctChoiceId: result.correct_choice_id
        });
        return newMap;
      });

      // Refresh status
      const newStatus = await courseService.getLessonQuestionsStatus(lessonId);
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmittingQuestion(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Comprehension Check
          </CardTitle>
          {status && (
            <div className={cn(
              "text-sm px-3 py-1 rounded-full",
              status.all_correct
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            )}>
              {status.correct_answers}/{status.total_questions} correct
            </div>
          )}
        </div>
        {!status?.all_correct && (
          <p className="text-sm text-muted-foreground">
            Answer all questions correctly to complete this lesson.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => {
          const answered = answeredQuestions.get(question.id);
          const isSubmitting = submittingQuestion === question.id;

          return (
            <div key={question.id} className="space-y-3">
              <p className="font-medium">
                {index + 1}. {question.text}
              </p>
              <div className="space-y-2 ml-4">
                {question.choices.map(choice => {
                  const isSelected = answered?.selectedChoiceId === choice.id;
                  const isCorrect = answered?.correctChoiceId === choice.id;
                  const showCorrect = answered && isCorrect;
                  const showIncorrect = answered && isSelected && !answered.isCorrect;

                  return (
                    <Button
                      key={choice.id}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left h-auto py-3 px-4",
                        !answered && "hover:bg-accent",
                        showCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20",
                        showIncorrect && "border-red-500 bg-red-50 dark:bg-red-900/20"
                      )}
                      disabled={Boolean(answered) || isSubmitting}
                      onClick={() => handleAnswer(question.id, choice.id)}
                    >
                      <span className="flex-1">{choice.text}</span>
                      {isSubmitting && isSelected && (
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      )}
                      {showCorrect && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                      )}
                      {showIncorrect && (
                        <XCircle className="h-4 w-4 ml-2 text-red-600" />
                      )}
                    </Button>
                  );
                })}
              </div>
              {answered && (
                <p className={cn(
                  "text-sm ml-4",
                  answered.isCorrect ? "text-green-600" : "text-red-600"
                )}>
                  {answered.isCorrect ? "Correct!" : "Incorrect. The correct answer is highlighted above."}
                </p>
              )}
            </div>
          );
        })}

        {status?.all_correct && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">All questions answered correctly! You can now complete this lesson.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
