# HalalFresh Grocery Store 🍉

A modern, mobile-friendly e-commerce platform for selling halal grocery items, built with React and Tailwind CSS. This project is the frontend application and is designed to connect to a separate backend server for data persistence and secure operations.

## Features

-   **User Accounts:** Customers can register, log in, and view their order history.
-   **Product Catalog:** Browse a list of available grocery items fetched from a backend API.
-   **Product Detail View:** Click on a product to see more details.
-   **Shopping Cart:** Add/remove items and update quantities.
-   **Tax Calculation:** Automatically calculates taxes for taxable items at checkout.
-   **Admin Dashboard:** A secure area for admin users to manage products and view all customer orders.

## Tech Stack

-   **Frontend:** React.js (Create React App)
-   **Styling:** Tailwind CSS
-   **State Management:** React Hooks (`useState`, `useEffect`)

## Getting Started

### Prerequisites

-   Node.js (v16 or later)
-   npm
-   A running instance of the `halal-fresh-backend` server.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/halal-fresh-store.git](https://github.com/your-username/halal-fresh-store.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd halal-fresh-store
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Set up Tailwind CSS:**
    ```sh
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    *(Then, configure your `tailwind.config.js` and `src/index.css` files as described in the project structure guide.)*

### Running the Application

To start the development server, run:

```sh
npm start
