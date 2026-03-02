<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>InvestProperti</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="font-sans antialiased bg-slate-50">
    <div class="min-h-screen flex flex-col">
        @include('welcome.header')

        <main class="flex-1 text-slate-50">
        @yield('content')
        </main>

        {{-- @include('welcome.footer --}}
    </div>
</body>
</html>
