"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
  completed: boolean;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CourseData {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz: Quiz[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<{
    score: number;
    passed: boolean;
    showResults: boolean;
  } | null>(null);

  // Sample course data - in production, this would come from IndexedDB or API
  const courseData: Record<string, CourseData> = {
    "math-class-1": {
      id: "math-class-1",
      title: "NCERT Math Class 1",
      lessons: [
        {
          id: "lesson-1",
          title: "Finding the furry Cat",
          content: [
            "Welcome to Class 1 Mathematics!",
            "In this lesson, we'll learn about counting and identifying objects.",
            "Look around you - can you find objects to count?",
            "Practice counting from 1 to 10 with different objects.",
          ],
          keyPoints: [
            "Counting helps us know how many things we have",
            "Numbers help us organize and understand quantities",
            "Practice makes counting easier",
          ],
          completed: false,
        },
        {
          id: "lesson-2",
          title: "What is long? What is round?",
          content: [
            "Objects come in different shapes and sizes.",
            "Some objects are long, like a pencil or a stick.",
            "Some objects are round, like a ball or a coin.",
            "Let's identify different shapes around us!",
          ],
          keyPoints: [
            "Shapes help us describe objects",
            "Long objects are stretched out",
            "Round objects are circular",
          ],
          completed: false,
        },
      ],
      quiz: [
        {
          id: "q1",
          question: "What helps us know how many things we have?",
          options: ["Counting", "Drawing", "Singing", "Running"],
          correctAnswer: 0,
          explanation: "Counting is the way we find out how many things we have.",
        },
        {
          id: "q2",
          question: "Which object is round?",
          options: ["Pencil", "Ball", "Stick", "Book"],
          correctAnswer: 1,
          explanation: "A ball is round because it has a circular shape.",
        },
        {
          id: "q3",
          question: "What is the first number we learn?",
          options: ["Zero", "One", "Ten", "Five"],
          correctAnswer: 1,
          explanation: "One is usually the first number children learn to count.",
        },
      ],
    },
    "math-class-2": {
      id: "math-class-2",
      title: "NCERT Math Class 2",
      lessons: [
        {
          id: "lesson-1",
          title: "Numbers from 1 to 100",
          content: [
            "Let's learn numbers from 1 to 100!",
            "Numbers help us count and measure things.",
            "Practice writing numbers and counting objects.",
          ],
          keyPoints: [
            "Numbers go from 1 to 100",
            "Each number has a name",
            "We use numbers every day",
          ],
          completed: false,
        },
      ],
      quiz: [
        {
          id: "q1",
          question: "What comes after 99?",
          options: ["98", "100", "101", "97"],
          correctAnswer: 1,
          explanation: "100 comes after 99 when counting.",
        },
      ],
    },
  };

  useEffect(() => {
    // Load course data - in production, from IndexedDB or API
    const course = courseData[courseId];
    if (course) {
      // Load progress from localStorage
      const stored = localStorage.getItem(`ruraledu-course-${courseId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        setCurrentLessonIndex(progress.currentLessonIndex || 0);
        if (progress.lessons) {
          course.lessons = course.lessons.map((lesson, idx) => ({
            ...lesson,
            completed: progress.lessons[idx]?.completed || false,
          }));
        }
      }
      setCourse(course);
    } else {
      router.push("/home");
    }
  }, [courseId, router]);

  useEffect(() => {
    if (course && course.lessons[currentLessonIndex]) {
      const activeData = {
        courseId,
        courseTitle: course.title,
        lessonIndex: currentLessonIndex,
        lessonTitle: course.lessons[currentLessonIndex].title,
        timestamp: Date.now()
      };
      localStorage.setItem("ruraledu-last-active", JSON.stringify(activeData));
    }
  }, [course, currentLessonIndex, courseId]);

  const handleNextLesson = () => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowQuiz(false);
      setQuizResults(null);
    } else {
      setShowQuiz(true);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleSubmitQuiz = () => {
    if (!course) return;

    let correct = 0;
    course.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / course.quiz.length) * 100);
    const passed = score >= 70;

    setQuizResults({
      score,
      passed,
      showResults: true,
    });

    // Save progress
    const stored = localStorage.getItem(`ruraledu-course-${courseId}`);
    const progress = stored ? JSON.parse(stored) : { lessons: [], currentLessonIndex: 0 };

    if (passed) {
      progress.lessons[currentLessonIndex] = { completed: true };
      localStorage.setItem(`ruraledu-course-${courseId}`, JSON.stringify(progress));
    }

    // Update global progress
    const globalProgress = localStorage.getItem("ruraledu-progress");
    if (globalProgress) {
      const data = JSON.parse(globalProgress);
      if (!data.courses[courseId]) {
        data.courses[courseId] = { downloaded: false, progress: 0 };
      }
      const completedLessons = progress.lessons.filter((l: any) => l?.completed).length;
      data.courses[courseId].progress = Math.round(
        (completedLessons / course.lessons.length) * 100
      );
      localStorage.setItem("ruraledu-progress", JSON.stringify(data));
    }

    // Track daily quiz completions for Daily Goal widget
    if (passed) {
      const today = new Date().toDateString();
      const quizData = localStorage.getItem("ruraledu-daily-quizzes");
      let dailyQuizzes = { date: today, count: 0 };
      if (quizData) {
        const parsed = JSON.parse(quizData);
        if (parsed.date === today) {
          dailyQuizzes = parsed;
        }
      }
      dailyQuizzes.count += 1;
      dailyQuizzes.date = today;
      localStorage.setItem("ruraledu-daily-quizzes", JSON.stringify(dailyQuizzes));

      // Track study time (approximate: 5 min per quiz)
      const timeData = localStorage.getItem("ruraledu-study-time");
      let studyTime = { date: today, minutes: 0 };
      if (timeData) {
        const parsed = JSON.parse(timeData);
        if (parsed.date === today) {
          studyTime = parsed;
        }
      }
      studyTime.minutes += 5;
      studyTime.date = today;
      localStorage.setItem("ruraledu-study-time", JSON.stringify(studyTime));
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="text-[#18659e] hover:text-[#153b52]"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-semibold text-[#153b52]">{course.title}</h1>
        </div>
        <div className="text-sm text-gray-600">
          Lesson {currentLessonIndex + 1} of {course.lessons.length}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!showQuiz && !quizResults?.showResults ? (
          /* Lesson View */
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#153b52] mb-4">
                {currentLesson.title}
              </h2>

              <div className="space-y-4 mb-6">
                {currentLesson.content.map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-[#18659e] p-4 rounded">
                <h3 className="font-semibold text-[#153b52] mb-2">Key Points:</h3>
                <ul className="space-y-1">
                  {currentLesson.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                      <span className="text-[#18659e] mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => {
                  if (currentLessonIndex > 0) {
                    setCurrentLessonIndex(currentLessonIndex - 1);
                  }
                }}
                disabled={currentLessonIndex === 0}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={handleNextLesson}
                className="px-6 py-2 bg-[#18659e] text-white rounded hover:bg-[#153b52] transition"
              >
                {currentLessonIndex < course.lessons.length - 1
                  ? "Next Lesson"
                  : "Take Quiz"}
              </button>
            </div>
          </div>
        ) : quizResults?.showResults ? (
          /* Quiz Results */
          <div className="text-center space-y-6">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${quizResults.passed ? "bg-green-100" : "bg-red-100"
                }`}
            >
              <span className="text-4xl">
                {quizResults.passed ? "✓" : "✗"}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#153b52] mb-2">
                {quizResults.passed ? "Congratulations!" : "Keep Practicing!"}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Your Score: {quizResults.score}%
              </p>
              <p className="text-gray-600">
                {quizResults.passed
                  ? "You passed! Great job on completing this lesson."
                  : "You need 70% to pass. Review the lesson and try again."}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              {quizResults.passed ? (
                <Link
                  href="/home"
                  className="px-6 py-2 bg-[#18659e] text-white rounded hover:bg-[#153b52] transition"
                >
                  Back to Courses
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setShowQuiz(true);
                    setQuizResults(null);
                    setQuizAnswers({});
                  }}
                  className="px-6 py-2 bg-[#18659e] text-white rounded hover:bg-[#153b52] transition"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz View */
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#153b52] mb-2">Quiz Time!</h2>
              <p className="text-gray-600">
                Answer the questions to test your understanding
              </p>
            </div>

            <div className="space-y-6">
              {course.quiz.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-[#153b52] mb-4">
                    {qIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center p-3 border rounded cursor-pointer transition ${quizAnswers[qIndex] === oIndex
                          ? "border-[#18659e] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={quizAnswers[qIndex] === oIndex}
                          onChange={() => handleQuizAnswer(qIndex, oIndex)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {quizResults?.showResults && (
                    <div
                      className={`mt-4 p-3 rounded ${quizAnswers[qIndex] === question.correctAnswer
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                        }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {quizAnswers[qIndex] === question.correctAnswer
                          ? "✓ Correct!"
                          : "✗ Incorrect"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmitQuiz}
                disabled={
                  Object.keys(quizAnswers).length !== course.quiz.length
                }
                className="px-8 py-3 bg-[#18659e] text-white rounded-lg hover:bg-[#153b52] disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
