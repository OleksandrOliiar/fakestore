# FakeStore E-commerce Application

A modern e-commerce web application built with Angular, showcasing a responsive design and essential online shopping features. This project demonstrates Angular capabilities for building interactive web applications while integrating with the [FakeStore API](https://fakestoreapi.com/).

![FakeStore Demo](https://fakestoreapi.com/icons/logo.png)

## Features

- **Product Browsing**: View all products with category filtering and price sorting
- **Search Functionality**: Find products quickly with the search feature
- **Product Details**: View detailed information about each product
- **User Authentication**: Sign in/out functionality with token-based auth
- **Responsive Cart System**: 
  - Add products to cart from both listing and detail pages
  - Adjust quantities or remove items
  - Sliding cart panel for easy viewing and management
  - Persistent cart that saves between sessions

## Technologies Used

- **Angular 19**: Latest version of the Angular framework
- **TailwindCSS**: For responsive and modern UI styling
- **RxJS**: For reactive state management
- **FakeStore API**: External API for product data
- **LocalStorage**: For cart persistence
- **Angular Standalone Components**: Modern Angular architecture

## Project Structure

The application follows a modular architecture:

- **Components**:
  - `ProductListComponent`: Displays and filters products
  - `ProductDetailsComponent`: Shows detailed product information
  - `LoginComponent`: Handles user authentication
  - `CartSheetComponent`: Manages the sliding cart panel

- **Services**:
  - `ProductService`: Manages API requests for products
  - `AuthService`: Handles authentication logic
  - `CartService`: Manages cart state and localStorage persistence
  - `SearchService`: Controls product search functionality

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli`)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd fakestore-angular
npm install
```

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Usage

### Test User Account

For testing purposes, use these credentials:
- **Username**: johnd
- **Password**: m38rmF$

### Shopping Flow

1. Browse products on the main page
2. Use categories to filter products
3. Sort products by price (ascending/descending)
4. Search for specific products using the search bar
5. Click on a product to view details
6. Add products to cart
7. Open the cart to view, adjust or remove items

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## API Reference

This application uses the [FakeStore API](https://fakestoreapi.com/) to retrieve product data. The API provides endpoints for:

- Getting all products
- Filtering products by category
- Sorting products by price
- User authentication
