// IndexedDB utility for offline course storage
const DB_NAME = "RuralEduDB";
const DB_VERSION = 2; // Incremented version to trigger upgrade for announcements
const STORE_COURSES = "courses";
const STORE_LESSONS = "lessons";
const STORE_ANNOUNCEMENTS = "announcements";

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  teacher?: { fullName: string | null };
  class?: { name: string };
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  content: any;
  downloadedAt: number;
}

export interface LessonData {
  courseId: string;
  lessonId: string;
  content: any;
}

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create courses store
      if (!database.objectStoreNames.contains(STORE_COURSES)) {
        const courseStore = database.createObjectStore(STORE_COURSES, {
          keyPath: "id",
        });
        courseStore.createIndex("title", "title", { unique: false });
      }

      // Create lessons store
      if (!database.objectStoreNames.contains(STORE_LESSONS)) {
        const lessonStore = database.createObjectStore(STORE_LESSONS, {
          keyPath: ["courseId", "lessonId"],
        });
        lessonStore.createIndex("courseId", "courseId", { unique: false });
      }

      // Create announcements store
      if (!database.objectStoreNames.contains(STORE_ANNOUNCEMENTS)) {
        database.createObjectStore(STORE_ANNOUNCEMENTS, {
          keyPath: "id",
        });
      }
    };
  });
}

export async function saveAnnouncements(announcements: AnnouncementData[]): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ANNOUNCEMENTS], "readwrite");
    const store = transaction.objectStore(STORE_ANNOUNCEMENTS);

    // Clear old announcements and save new ones
    store.clear();
    announcements.forEach((a) => store.put(a));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getAllAnnouncements(): Promise<AnnouncementData[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ANNOUNCEMENTS], "readonly");
    const store = transaction.objectStore(STORE_ANNOUNCEMENTS);
    const request = store.getAll();

    request.onsuccess = () => {
      const data = request.result || [];
      // Sort by date descending
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(data);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveCourse(course: CourseData): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_COURSES], "readwrite");
    const store = transaction.objectStore(STORE_COURSES);
    const request = store.put({
      ...course,
      downloadedAt: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCourse(courseId: string): Promise<CourseData | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_COURSES], "readonly");
    const store = transaction.objectStore(STORE_COURSES);
    const request = store.get(courseId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCourses(): Promise<CourseData[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_COURSES], "readonly");
    const store = transaction.objectStore(STORE_COURSES);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCourse(courseId: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_COURSES], "readwrite");
    const store = transaction.objectStore(STORE_COURSES);
    const request = store.delete(courseId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveLesson(lesson: LessonData): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_LESSONS], "readwrite");
    const store = transaction.objectStore(STORE_LESSONS);
    const request = store.put(lesson);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getLesson(
  courseId: string,
  lessonId: string
): Promise<LessonData | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_LESSONS], "readonly");
    const store = transaction.objectStore(STORE_LESSONS);
    const request = store.get([courseId, lessonId]);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}
