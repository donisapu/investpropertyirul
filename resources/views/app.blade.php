<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

    @php
        $settings = DB::table('website_settings')->first();
        $logo = $settings->logo ?? null;

        if ($logo) {
            $finalLogo =
                str_starts_with($logo, 'http') || str_starts_with($logo, '/') ? $logo : asset('storage/' . $logo);
        } else {
            $finalLogo = asset('assets/img/logo.png');
        }
    @endphp
    <link rel="icon" type="image/x-icon" href="{{ $finalLogo }}" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
