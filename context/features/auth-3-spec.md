# UI Implementation for Authentication (Login, Register, and Sidebar Profile)

We need to build custom UI components to replace the default NextAuth v5 pages. The application uses Next.js App Router, NextAuth v5 (with GitHub and Credentials providers), and Tailwind CSS. 

Please implement the following three main requirements. **CRITICAL:** All user-facing text, labels, and error messages MUST be in Spanish.

---

### 1. Custom Login Page (`app/login/page.tsx`)
Create a modern, responsive Login page.
- **Providers:** Include a button for GitHub OAuth login and a form for Email/Password (Credentials provider).
- **Form Elements:** Email input, Password input, and a Submit button ("Iniciar sesión").
- **Links:** - Add a link for "Olvidé mi contraseña" pointing to `/forgot-password` (we will build this page later).
  - Add a link to register: "¿No tienes cuenta? Regístrate aquí" pointing to `/register`.
- **Error Handling:** Read NextAuth error parameters from the URL (e.g., `?error=CredentialsSignin`). Display friendly, human-readable error messages in Spanish (e.g., "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.").

### 2. Custom Register Page (`app/register/page.tsx`)
Create a Registration page that interacts with our existing `/api/auth/register` endpoint.
- **Form Elements:** Inputs for "Nombre" (Name), "Correo electrónico" (Email), "Contraseña" (Password), and "Confirmar contraseña" (Password Confirm).
- **Client-Side Validation:** Ensure passwords match and meet basic security rules (minimum 8 characters) before allowing submission. Show inline validation errors in Spanish.
- **Submission Logic:** Prevent default form submission and send a `POST` request to `/api/auth/register` with the JSON payload.
- **Success/Error Handling:**
  - On success (201 Created): Redirect the user to the `/login` page (optionally with a success query param like `?registered=true` to show a success toast in Spanish).
  - On error (e.g., 409 Conflict): Catch the API error and display a friendly message in Spanish (e.g., "Este correo ya está registrado" or "Ha ocurrido un error inesperado").

### 3. User Data & Avatar in the Sidebar
Extract the user session data and display it elegantly in the sidebar.
- **Avatar Logic (`Avatar` component):**
  - If the user logged in via GitHub and has an image (`session.user.image`), display it using `next/image` or a standard `<img>` tag with proper styling.
  - FALLBACK: If there is no image, generate an avatar with the user's initials. For example, if the name is "JUAN FERNANDEZ", show "JF". If it's just "Juan", show "J". Use a nice background color for the fallback avatar.
- **UserProfile Component:** Create a new component (e.g., `UserProfile.tsx` in the components folder). 
  - Group the Avatar component, the user's Name, and Email inside this component.
  - Wrap the user info in a link pointing to `/profile` (we will build this later).
  - Directly underneath the user info, add a highly visible "Cerrar sesión" (Log out) button/link.
  - The "Cerrar sesión" button must trigger NextAuth's sign-out flow (either via a server action or client-side `signOut()` depending on your architecture).
- **Sidebar Integration:** Update the existing Sidebar component (e.g., `@components/sidebar.tsx`) to import and render this new `UserProfile` component at the bottom of the sidebar.

Ensure all forms use proper accessibility attributes and manage loading states (e.g., disabling buttons while submitting and showing a spinner).

### 4. Testing
Go to /sign-in - verify custom page renders
Sign in with GitHub - verify flow works
Sign in with email/password - verify flow works
Verify avatar shows in top bar (GitHub image or initials)
Click avatar - verify dropdown appears
Click "Sign out" - verify logout and redirect
Go to /register - create new account - verify redirect to sign-in