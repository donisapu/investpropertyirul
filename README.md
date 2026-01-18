## InvestProperti — Local Development Setup

Follow these steps to run the project locally from a clean checkout.

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+ and npm
- PostgreSQL (recommended; project queries use `ilike`)

### 1) Install PHP dependencies
```bash
composer install
```

### 2) Install JS dependencies
```bash
npm install
```

### 3) Build frontend assets
For development:
```bash
npm run dev
```
For a production build:
```bash
npm run build
```

### 4) Create environment file
Copy the example env and update values:
```bash
cp .env.example .env
```
Recommended env settings:
```
APP_NAME=InvestProperti
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=invest
DB_USERNAME=postgres
DB_PASSWORD=secret
```

### 5) Generate app key
```bash
php artisan key:generate
```

### 6) Run migrations
```bash
php artisan migrate
```

### 7) Link storage (for uploaded files)
```bash
php artisan storage:link
```

### 8) Seed the database
```bash
php artisan db:seed
```
This creates:
- Roles: `admin`, `user`
- Admin user: `admin@mail.com` / `Admin@123`
- Website settings row with default values (including YouTube video URL placeholder)

### 9) Start the application
```bash
php artisan serve
```
Open http://localhost:8000

### Notes
- Admin dashboard routes are under `/admin` and require authentication and the `admin` role.
- Update the YouTube preview: edit Website Settings in the admin and set a valid `youtube_video_url` (e.g., a `https://www.youtube.com/watch?v=VIDEO_ID` link).
