# Final Project - VR

This is the final project repository for **kerenvr**, created using **Vite** and **React**. The project is focused on an e-commerce application that includes product pages, a shopping cart, and database integration via **Supabase**.

## Table of Contents

- [Project Overview](#project-overview)
- [Current Functionality](#current-functionality)
  - [Cart Functionality](#cart-functionality)
  - [Database Integration](#database-integration)
  - [Responsive Design](#responsive-design)
- [Database Schemas](#database-schemas)
  - [Users](#users)
  - [Carts](#carts)
  - [Discounts](#discounts)
  - [Product Images](#product-images)
  - [Products](#products)
- [Future Enhancements](#future-enhancements)
- [Getting Started](#getting-started)
- [License](#license)

## Project Overview

This is an e-commerce project built using **React**, **Vite**, and **Supabase** for handling the database. Initially, I started the project with **Express** and a local **PostgreSQL** database, but later switched to **Supabase** for a cloud-hosted database solution. The site includes basic functionality for displaying products, adding items to the cart, and managing user interactions.

### Features:

- **React Router** for navigation
- **Supabase** as the cloud-hosted database
- Shopping cart functionality
- Basic product display pages
- State management using React hooks

## Current Functionality

### Cart Functionality

The shopping cart functionality is designed to handle the number of items a user wants to purchase. Key features of the cart include:

- **Counter**: Tracks the quantity of items in the cart. The counter cannot go below zero. If the user clicks the minus button, the quantity will remain at 0.
- **Add to Cart**: When the user adds items to the cart, the quantity is sent to the database and the cart icon in the navbar is updated with the current cart count.

The cart count is dynamically fetched from the database to keep it in sync across the application.

### Database Integration

I initially started with **Express** and a local **PostgreSQL** database, but I switched to **Supabase** for a cloud-hosted database solution. All data displayed on the product pages is pulled from the database.

- **Supabase** is used for user authentication and database queries.
- The **cart** and product information are dynamically retrieved using Supabase's API.

### Responsive Design

The design is responsive and adapts to different screen sizes. For more details, see the images at the end of the Word document provided.

## Database Schemas

### Users

The user table includes basic information for users, with a default `user_id` set to `1` for development purposes.

### Carts

The `Carts` table links products to users with foreign keys for `product_id` and `user_id`.

### Discounts

The `Discounts` table includes information about any applicable discounts for products.

### Product Images

The `Product Images` table holds image data related to the products in the catalog.

### Products

The `Products` table contains all product-related information, including the name, description, price, and availability.

## Future Enhancements

- **Image Slideshow**: Add a product image slideshow for better user experience.
- **User Dropdown**: Add a user profile dropdown for easier navigation.
- **Phone Navbar Dropdown**: Implement a dropdown for the navbar on smaller screen sizes to improve mobile responsiveness.
- **Cart Update Logic**: Enhance the logic to update the user's cart and recalculate the cost when additional items are added.

## Getting Started

To get started with the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/kerenvr/final-projectvr.git
   ```
2. Navigate to the project directory:

   ```bash
       cd final-projectvr
   ```

3. Install the dependencies:

   ```bash
       npm install
   ```

4. Set up your Supabase account and update the .env file with your credentials.

5. Run the development server:
   ```
       bash
       npm run dev
   ```
6. Open the application in your browser at http://localhost:5173.
