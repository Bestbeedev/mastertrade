<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Course;
use Inertia\Controller;
use Illuminate\Http\Request;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\CourseEnrollment;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::withCount('lessons')
            ->select(['id', 'title', 'description', 'is_paid', 'price', 'cover_image', 'duration_seconds', 'created_at'])
            ->latest()->get();

        $enrollments = CourseEnrollment::where('user_id', Auth::id())
            ->get(['course_id', 'progress_percent'])
            ->keyBy('course_id');

        $courses = $courses->map(function ($c) use ($enrollments) {
            $progress = optional($enrollments->get($c->id))->progress_percent ?? 0;
            return [
                'id' => $c->id,
                'title' => $c->title,
                'description' => $c->description,
                'is_paid' => $c->is_paid,
                'price' => $c->price,
                'cover_image' => $c->cover_image,
                'duration_seconds' => $c->duration_seconds,
                'lessons_count' => $c->lessons_count,
                'progress_percent' => (int) $progress,
            ];
        });

        return Inertia::render('client/formation', [
            'courses' => $courses,
        ]);
    }

    public function allcourses()
    {
        return Inertia::render('client/partials/formations');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'is_paid' => ['nullable', 'boolean'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'product_id' => ['nullable', 'string', 'exists:products,id'],
            'cover_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],

            'modules' => ['nullable', 'array'],
            'modules.*.title' => ['required_with:modules', 'string', 'max:255'],
            'modules.*.description' => ['nullable', 'string'],
            'modules.*.position' => ['nullable', 'integer', 'min:0'],
            'modules.*.lessons' => ['nullable', 'array'],
            'modules.*.lessons.*.title' => ['required_with:modules.*.lessons', 'string', 'max:255'],
            'modules.*.lessons.*.type' => ['required_with:modules.*.lessons', 'in:video,pdf'],
            'modules.*.lessons.*.content_url' => ['nullable', 'string'],
            'modules.*.lessons.*.is_preview' => ['nullable', 'boolean'],
            'modules.*.lessons.*.duration_seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $isPaid = (bool) ($validated['is_paid'] ?? false);
        $price = $isPaid ? (float) ($validated['price'] ?? 0) : 0;

        $course = Course::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_paid' => $isPaid,
            'price' => $price,
            'product_id' => $validated['product_id'] ?? null,
        ]);

        // Cover image upload
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('courses/covers', 'public');
            $course->cover_image = $path;
            $course->save();
        }

        // Create modules and lessons
        $modules = $request->input('modules', []);
        $totalDuration = 0;
        foreach ($modules as $mi => $mod) {
            if (!isset($mod['title'])) {
                continue;
            }
            $module = CourseModule::create([
                'course_id' => $course->id,
                'title' => $mod['title'],
                'description' => $mod['description'] ?? null,
                'position' => $mod['position'] ?? $mi,
            ]);

            $lessons = $mod['lessons'] ?? [];
            foreach ($lessons as $li => $les) {
                if (!isset($les['title'], $les['type'])) {
                    continue;
                }
                $type = $les['type'];
                $contentUrl = null;
                if ($type === 'video') {
                    $contentUrl = $les['content_url'] ?? null; // expected YouTube URL
                } else {
                    // PDF upload
                    $file = $request->file("modules.$mi.lessons.$li.file");
                    if ($file) {
                        $contentUrl = $file->store('courses/pdfs', 'public');
                    }
                }

                $lesson = Lesson::create([
                    'course_id' => $course->id,
                    'module_id' => $module->id,
                    'title' => $les['title'],
                    'position' => $les['position'] ?? $li,
                    'content_url' => $contentUrl ?? ($les['content_url'] ?? ''),
                    'type' => $type,
                    'is_preview' => (bool) ($les['is_preview'] ?? false),
                    'duration_seconds' => $les['duration_seconds'] ?? null,
                ]);
                $totalDuration += (int) ($lesson->duration_seconds ?? 0);
            }
        }

        // Compute course duration
        if ($totalDuration > 0) {
            $course->duration_seconds = $totalDuration;
            $course->save();
        }

        return back()->with('status', 'Formation créée');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load([
            'modules' => function ($q) {
                $q->orderBy('position');
            },
            'modules.lessons' => function ($q) {
                $q->orderBy('position');
            },
        ]);

        $enrollment = CourseEnrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)->first();
        $completed = LessonProgress::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->whereNotNull('completed_at')
            ->pluck('lesson_id');

        return Inertia::render('client/course', [
            'course' => $course,
            'is_enrolled' => (bool) $enrollment,
            'progress_percent' => (int) ($enrollment->progress_percent ?? 0),
            'completed_lessons' => $completed,
        ]);
    }

    /**
     * Display course content page.
     */
    public function content(Course $course)
    {
        return Inertia::render('client/course', [
            'course' => $course,
        ]);
    }

    /**
     * Enroll current user to course (stub).
     */
    public function enroll(Request $request, Course $course)
    {
        $userId = Auth::id();
        CourseEnrollment::firstOrCreate([
            'user_id' => $userId,
            'course_id' => $course->id,
        ], [
            'started_at' => now(),
            'progress_percent' => 0,
        ]);
        return back()->with('status', 'Inscription effectuée');
    }

    /**
     * Mark lesson as completed (stub).
     */
    public function completeLesson(Request $request, Course $course)
    {
        $data = $request->validate([
            'lesson_id' => ['required', 'string', 'exists:lessons,id'],
            'position_seconds' => ['nullable', 'integer', 'min:0'],
            'seconds_watched' => ['nullable', 'integer', 'min:0'],
            'completed' => ['nullable', 'boolean'],
        ]);
        $userId = Auth::id();
        $progress = LessonProgress::firstOrCreate([
            'user_id' => $userId,
            'course_id' => $course->id,
            'lesson_id' => $data['lesson_id'],
        ]);
        if (isset($data['position_seconds'])) {
            $progress->last_position_seconds = $data['position_seconds'];
        }
        if (isset($data['seconds_watched'])) {
            $progress->seconds_watched = max((int) $progress->seconds_watched, (int) $data['seconds_watched']);
        }
        if (!empty($data['completed'])) {
            $progress->completed_at = now();
        }
        $progress->save();

        // Recompute course progress
        $total = Lesson::where('course_id', $course->id)->count();
        $completed = LessonProgress::where('user_id', $userId)->where('course_id', $course->id)->whereNotNull('completed_at')->count();
        $percent = $total > 0 ? (int) floor(($completed / $total) * 100) : 0;
        CourseEnrollment::where('user_id', $userId)->where('course_id', $course->id)
            ->update(['progress_percent' => $percent, 'last_lesson_id' => $data['lesson_id']]);

        return response()->json(['ok' => true, 'progress_percent' => $percent]);
    }

    /**
     * Generate certificate (stub).
     */
    public function certificate(Course $course)
    {
        return response()->json(['certificate_url' => '#']);
    }

    /**
     * List user's courses (stub page).
     */
    public function myCourses()
    {
        return Inertia::render('client/formation');
    }

    /**
     * Course progress page (stub page).
     */
    public function progress()
    {
        $userId = Auth::id();
        $courses = Course::select(['id', 'title', 'cover_image', 'duration_seconds'])->get();
        $payload = [];
        foreach ($courses as $course) {
            $total = Lesson::where('course_id', $course->id)->count();
            $completed = LessonProgress::where('user_id', $userId)->where('course_id', $course->id)->whereNotNull('completed_at')->count();
            $percent = $total > 0 ? (int) floor(($completed / $total) * 100) : 0;
            $payload[] = [
                'course_id' => $course->id,
                'title' => $course->title,
                'cover_image' => $course->cover_image,
                'total' => $total,
                'completed' => $completed,
                'percent' => $percent,
            ];
        }
        return Inertia::render('client/course-progress', [
            'progress' => $payload,
        ]);
    }

    /**
     * Course progress data (stub API).
     */
    public function progressData()
    {
        $userId = Auth::id();
        $courses = Course::select(['id', 'title'])->get();
        $data = [];
        foreach ($courses as $course) {
            $total = Lesson::where('course_id', $course->id)->count();
            $completed = LessonProgress::where('user_id', $userId)->where('course_id', $course->id)->whereNotNull('completed_at')->count();
            $percent = $total > 0 ? (int) floor(($completed / $total) * 100) : 0;
            $data[] = [
                'course_id' => $course->id,
                'title' => $course->title,
                'completed' => $completed,
                'total' => $total,
                'percent' => $percent,
            ];
        }
        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $course->load([
            'modules' => function ($q) {
                $q->orderBy('position');
            },
            'modules.lessons' => function ($q) {
                $q->orderBy('position');
            },
            'product:id,name'
        ]);
        $products = \App\Models\Product::select(['id', 'name'])->orderBy('name')->get();
        return Inertia::render('admin/course-edit', [
            'course' => $course,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'is_paid' => ['nullable', 'boolean'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'product_id' => ['nullable', 'string', 'exists:products,id'],
            'cover_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],

            'modules' => ['nullable', 'array'],
            'modules.*.title' => ['required_with:modules', 'string', 'max:255'],
            'modules.*.description' => ['nullable', 'string'],
            'modules.*.position' => ['nullable', 'integer', 'min:0'],
            'modules.*.lessons' => ['nullable', 'array'],
            'modules.*.lessons.*.title' => ['required_with:modules.*.lessons', 'string', 'max:255'],
            'modules.*.lessons.*.type' => ['required_with:modules.*.lessons', 'in:video,pdf'],
            'modules.*.lessons.*.content_url' => ['nullable', 'string'],
            'modules.*.lessons.*.is_preview' => ['nullable', 'boolean'],
            'modules.*.lessons.*.duration_seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $isPaid = (bool) ($validated['is_paid'] ?? false);
        $price = $isPaid ? (float) ($validated['price'] ?? 0) : 0;

        $course->fill([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_paid' => $isPaid,
            'price' => $price,
            'product_id' => $validated['product_id'] ?? null,
        ])->save();

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('courses/covers', 'public');
            $course->cover_image = $path;
            $course->save();
        }

        // Replace modules & lessons entirely from payload
        $modules = $request->input('modules', []);
        // delete existing
        foreach ($course->modules as $m) {
            $m->lessons()->delete();
        }
        $course->modules()->delete();

        $totalDuration = 0;
        foreach ($modules as $mi => $mod) {
            if (!isset($mod['title'])) {
                continue;
            }
            $module = CourseModule::create([
                'course_id' => $course->id,
                'title' => $mod['title'],
                'description' => $mod['description'] ?? null,
                'position' => $mod['position'] ?? $mi,
            ]);

            $lessons = $mod['lessons'] ?? [];
            foreach ($lessons as $li => $les) {
                if (!isset($les['title'], $les['type'])) {
                    continue;
                }
                $type = $les['type'];
                $contentUrl = null;
                if ($type === 'video') {
                    $contentUrl = $les['content_url'] ?? null; // expected YouTube URL
                } else {
                    // PDF upload (replace)
                    $file = $request->file("modules.$mi.lessons.$li.file");
                    if ($file) {
                        $contentUrl = $file->store('courses/pdfs', 'public');
                    } else {
                        $contentUrl = $les['content_url'] ?? null; // keep existing path if provided
                    }
                }

                $lesson = Lesson::create([
                    'course_id' => $course->id,
                    'module_id' => $module->id,
                    'title' => $les['title'],
                    'position' => $les['position'] ?? $li,
                    'content_url' => $contentUrl ?? '',
                    'type' => $type,
                    'is_preview' => (bool) ($les['is_preview'] ?? false),
                    'duration_seconds' => $les['duration_seconds'] ?? null,
                ]);
                $totalDuration += (int) ($lesson->duration_seconds ?? 0);
            }
        }

        $course->duration_seconds = $totalDuration ?: null;
        $course->save();

        return back()->with('status', 'Formation mise à jour');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();
        return back()->with('status', 'Formation supprimée');
    }
}
