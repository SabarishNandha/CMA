
# Project README

## Overview
This project demonstrates expertise in Angular and ASP.NET Core, featuring a user-friendly interface for managing contacts. It includes custom middleware to handle authorization and error management, ensuring secure access and robust error handling.

## Technologies Used
- **Angular**: For building dynamic web applications with optimized code.
- **ASP.NET Core**: Used for creating a RESTful API to manage contacts.
- **JSON**: Contact data is stored in a JSON file.
- **Dependency Injection**: Applied for managing logging and services.
- **Detailed Logging**: Logs requests, errors, and unauthorized access attempts to aid debugging and monitoring.

## Features

### Angular Application
- **Contact Management**:
  - Modals for creating and editing contacts.
  - Confirmation modals for contact deletion.
  - Efficient data processing through optimized filtering and observables.

### ASP.NET Core API for Contact Management
- **Endpoints**:
  - `GET /Contact/GetContacts`: Retrieves all contacts.
  - `GET /Contact/GetContactById`: Retrieves a specific contact by ID.
  - `POST /Contact/AddContact`: Adds a new contact.
  - `PUT /Contact/UpdateContact`: Updates an existing contact.
  - `DELETE /Contact/DeleteContact`: Deletes a contact by ID.

- **Custom Middleware**:
  - **Authorization Middleware**: Manages authorization tokens and provides detailed error responses (404, 401, 500).
  - **Global Expection Middleware**:  It intercepts unhandled exceptions that occur during the processing of HTTP requests, allowing you to log the error, format a response, and potentially redirect the user or provide a user-friendly error message.

## Setup Instructions

### Prerequisites
Ensure the following are installed:

- **Node.js** (version 16 or higher): Download from [nodejs.org](https://nodejs.org).
- **npm**: Comes bundled with Node.js. Verify installation by running:
  ```bash
  node -v
  npm -v
  ```

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Set Up Angular Client**:
   ```bash
   cd clientApp
   npm install
   ```

3. **Set Up ASP.NET Core API**:
   - Navigate back to the root directory:
     ```bash
     cd ..
     ```
   - Restore dependencies:
     ```bash
     dotnet restore
     ```
   - Run the API application:
     ```bash
     dotnet run
     ```
