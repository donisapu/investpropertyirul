<?php

namespace App\Http\Middleware;

use App\Support\Features;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * `feature:investment` / `feature:crowdfunding` — answers 404 while the
 * product is switched off, so hidden pages look like they never existed.
 * Several features (`feature:investment,crowdfunding`) pass when any is on.
 */
class EnsureFeatureEnabled
{
    public function handle(Request $request, Closure $next, string ...$features): Response
    {
        abort_unless(collect($features)->contains(fn ($f) => Features::enabled($f)), 404);

        return $next($request);
    }
}
