<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Developer;
use App\Services\DeveloperService;
use App\Http\Requests\StoreDeveloperRequest;
use App\Http\Requests\UpdateDeveloperRequest;

class DeveloperController extends Controller
{
    public function __construct(
        protected DeveloperService $service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Developer::latest()->paginate(10);
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
    public function store(StoreDeveloperRequest $request)
    {
        $developer = $this->service->store($request->validated());

        return response()->json($developer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Developer $developer)
    {
        return $developer;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeveloperRequest $request, Developer $developer)
    {
        $developer = $this->service->update($developer, $request->validated());

        return response()->json($developer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Developer $developer)
    {
        $this->service->delete($developer);

        return response()->json([
            'message' => 'Developer deleted successfully'
        ]);
    }
}
