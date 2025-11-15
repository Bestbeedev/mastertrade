<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Course;
use Inertia\Controller;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('client/formation');
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        return Inertia::render('client/course', [
            'course' => $course,
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
        return back()->with('status', 'Enrolled');
    }

    /**
     * Mark lesson as completed (stub).
     */
    public function completeLesson(Request $request, Course $course)
    {
        return response()->json(['ok' => true]);
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
        return Inertia::render('client/formation');
    }

    /**
     * Course progress data (stub API).
     */
    public function progressData()
    {
        return response()->json([
            'completed' => 5,
            'total' => 10,
            'percent' => 50,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        //
    }
}
