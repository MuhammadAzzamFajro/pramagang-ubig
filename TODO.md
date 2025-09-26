# TODO: Fix Sanctum Session Redirect Error in MagangController

## Steps to Complete:

- [x] Update backend/config/sanctum.php: Set 'stateful' to empty array [] and 'guard' to empty array [] to disable session-based auth and force token-only.
- [x] Update backend/routes/api.php: Add POST /api/verify-token route under the 'auth:sanctum' group, mapping to [AuthController::class, 'verifyToken'].
- [x] Clear Laravel config and route cache: Execute `php artisan config:clear && php artisan route:clear`.
- [x] Verify the fix: Test unauthenticated request to /api/magang should return 401 JSON (not redirect), and authenticated should work.

After all steps, mark as complete and remove this file if desired.
