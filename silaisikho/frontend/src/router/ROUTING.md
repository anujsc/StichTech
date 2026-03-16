# How Routing Works in SilaiSikho

## The Big Picture

There are three kinds of routes in this app:

1. **Public** — anyone can visit, logged in or not
2. **Private** — only logged-in students can visit
3. **Admin** — only logged-in admins can visit

---

## Public Routes

These pages are open to everyone. No login needed.

| Path | Page |
|---|---|
| `/` | Landing Page |
| `/courses` | Course Catalog |
| `/courses/:slug` | Course Detail |
| `/login` | Login Page |
| `/design-system` | Dev-only test page |

---

## How a Private Route Works

The `PrivateRoute` component is a gatekeeper. It sits **between** the router and the actual page.

```
User visits /dashboard
        ↓
  PrivateRoute runs
        ↓
  isLoggedIn = true?  ──YES──→  Show the page (via <Outlet />)
        ↓ NO
  Redirect to /login
```

The code:

```tsx
function PrivateRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
```

- `useAuth()` reads the auth state from `AuthContext`
- `isLoggedIn` is `true` only when there is both a token AND a `currentUser` set
- `<Outlet />` means "render whatever child route matched" — i.e. the actual page
- `<Navigate replace />` sends the user to `/login` without adding the blocked URL to browser history

**Protected pages using PrivateRoute:**

| Path | Page |
|---|---|
| `/dashboard` | Student Dashboard |
| `/watch/:courseId/:videoId` | Watch Video |

---

## How an Admin Route Works

`AdminRoute` does **two checks** in sequence:

```
User visits /admin
        ↓
  AdminRoute runs
        ↓
  isLoggedIn = false? ──→  Redirect to /login
        ↓ true
  isAdmin = false?    ──→  Redirect to /dashboard  (logged in but not admin)
        ↓ true
  Show the page (via <Outlet />)
```

The code:

```tsx
function AdminRoute() {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin)    return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
```

- A regular student who tries to visit `/admin` gets bounced to their own dashboard
- A logged-out user gets sent to `/login`

**Protected pages using AdminRoute:**

| Path | Page |
|---|---|
| `/admin` | Admin Dashboard |
| `/admin/courses` | Manage Courses |
| `/admin/courses/:courseId/edit` | Course Editor |
| `/admin/students` | Manage Students |

---

## How the Router is Structured

React Router v6 uses **nested routes** to apply the guards. The guard component has no `path` of its own — it just wraps child routes.

```
router
├── /                        (public)
├── /courses                 (public)
├── /courses/:slug           (public)
├── /login                   (public)
│
├── <PrivateRoute>           (no path — just a guard)
│   ├── /dashboard
│   └── /watch/:courseId/:videoId
│
└── <AdminRoute>             (no path — just a guard)
    ├── /admin
    ├── /admin/courses
    ├── /admin/courses/:courseId/edit
    └── /admin/students
```

---

## Where `isLoggedIn` and `isAdmin` Come From

Both values live in `AuthContext` (`src/context/AuthContext.tsx`):

```ts
isLoggedIn = !!token && !!currentUser   // true only when both exist
isAdmin    = currentUser?.role === 'admin'
```

So the flow when a user logs in is:
1. API returns a token + user object
2. `setToken(token)` saves it to `localStorage` and state
3. `setCurrentUser(user)` saves the user object to state
4. `isLoggedIn` becomes `true`
5. If `user.role === 'admin'`, `isAdmin` also becomes `true`
6. Any `PrivateRoute` or `AdminRoute` now lets them through

And when they log out:
1. `setToken(null)` clears localStorage and state
2. `setCurrentUser(null)` clears the user
3. `isLoggedIn` becomes `false`
4. Guards immediately redirect on next navigation
