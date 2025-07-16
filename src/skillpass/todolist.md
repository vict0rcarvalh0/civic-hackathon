# Authora - Project Todo List

This document outlines the tasks required to build a functional Authora application, focusing on core features beyond the initial Civic Auth integration.

## I. User Dashboard (`/dashboard`)

- [ ] **Layout & Structure:**
  - [ ] Create a basic responsive layout for the dashboard page (`app/dashboard/page.tsx`).
  - [ ] Design sections for: User Profile Summary, Wallet Information, Payment Links Management.
- [ ] **User Information Display:**
  - [ ] Fetch and display user information from `useUser()` hook (e.g., email, Civic ID if available).
- [ ] **Navigation:**
  - [ ] Ensure clear navigation within the dashboard (if it becomes complex with multiple sub-pages).

## II. Embedded Wallet Features (Client-Side)

- [ ] **Display Wallet Details:**
  - [ ] Retrieve and display the user's connected wallet address (from `useUser()` or related Civic SDK functions).
  - [ ] Research and implement displaying wallet balance (e.g., for common EVM tokens like ETH/USDC on a supported testnet).
    - This will likely involve using Civic's wallet interaction methods or a library like `ethers.js` / `viem` with the provider from Civic.
- [ ] **Transaction History (Stretch Goal):**
  - [ ] Explore options to display a basic transaction history for the embedded wallet.
- [ ] **Send Functionality (Optional MVP - consider complexity for hackathon):**
  - [ ] UI for sending crypto from the embedded wallet (specify recipient, amount, token).
  - [ ] Integrate with Civic SDK to initiate and sign transactions.

## III. Public Payment Links

- [ ] **Backend - API Routes (`app/api/payment-links/...`):**
  - [ ] `POST /api/payment-links/create`: Endpoint to create a new payment link (store in a database or simple in-memory store for hackathon).
    - Input: amount, currency/token, description, associated user ID.
    - Output: unique link ID/URL.
  - [ ] `GET /api/payment-links/[linkId]`: Endpoint to fetch details for a specific payment link (for the public payment page).
  - [ ] `GET /api/payment-links/user`: Endpoint to list all payment links for the currently logged-in user.
  - [ ] (Optional) `PUT /api/payment-links/[linkId]`: Endpoint to update a payment link.
  - [ ] (Optional) `DELETE /api/payment-links/[linkId]`: Endpoint to delete a payment link.
- [ ] **Frontend - Dashboard Integration:**
  - [ ] UI form in the dashboard to create new payment links.
  - [ ] Display a list of the user's existing payment links (with public URL, amount, status).
  - [ ] Functionality to copy/share payment links.
- [ ] **Frontend - Public Payment Page (e.g., `/pay/[linkId]` or `/[username]/[linkId]`):
  - [ ] Create a dynamic route and page to display payment link details (recipient, amount, description).
  - [ ] UI for the payer to connect their own wallet (e.g., MetaMask, WalletConnect, or potentially leverage Civic if it supports payer-side wallet interactions easily).
  - [ ] Logic to initiate the payment transaction to the creator's embedded wallet address.
  - [ ] Display transaction status (pending, success, failure) to the payer.

## IV. User Profile & Settings (Minimal for MVP)

- [ ] **Basic Profile Page (`/dashboard/profile` or `/dashboard/settings`):**
  - [ ] Display current user details.
  - [ ] (Optional) Allow updating a display name if applicable.
- [ ] **Logout:** (Already implemented via `AuthButton`)

## V. General UI/UX & Polish

- [ ] **Styling:**
  - [ ] Maintain consistent styling using shadcn/ui and Tailwind CSS across all new components and pages.
  - [ ] Ensure responsive design for all new features.
- [ ] **User Feedback:**
  - [ ] Implement loading states for asynchronous operations (API calls, wallet interactions).
  - [ ] Provide clear success and error messages/notifications (e.g., using a toast library if not built into shadcn/ui).
- [ ] **Error Handling:**
  - [ ] Robust error handling for all API interactions and wallet operations.

## VI. Database/Storage (Hackathon Scope)

- [ ] Decide on a simple storage solution for payment links (e.g., Vercel KV, Supabase free tier, or even local/in-memory for a pure frontend demo if backend is too complex for timeframe).
  - For a hackathon, a simple mock/local storage might be sufficient if the focus is on the Civic integration and core frontend flow.

## VII. Hackathon Submission Prep

- [ ] **Address Judging Criteria:** Review criteria and ensure the project highlights them.
  - [ ] Quality of Civic Auth integration.
  - [ ] Go-to-market readiness/potential.
  - [ ] Use case originality.
  - [ ] Presentation quality.
- [ ] **Demo Script & Video:**
  - [ ] Plan a clear demo flow showcasing the key features.
  - [ ] Record and edit a compelling demo video.
- [ ] **README & Repository:**
  - [ ] Update `README.md` with project description, setup instructions, and how to run the demo.
  - [ ] Ensure the GitHub repository is clean, well-documented, and publicly accessible.

## VIII. Nice-to-Haves / Post-Hackathon

- [ ] Customization options for payment links/pages.
- [ ] Support for multiple cryptocurrencies/tokens.
- [ ] More advanced user profile settings.
- [ ] Analytics for payment links.
- [ ] Email notifications (e.g., for successful payments).
