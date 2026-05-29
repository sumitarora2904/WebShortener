# WebShortener

A lightweight, fast, and secure URL shortener built with Deno, TypeScript, and MongoDB.

## Features
- **Fast Redirection:** Built on Deno's native `Deno.serve` HTTP server for optimal performance.
- **Persistent Storage:** Utilizes MongoDB for reliable short-to-long URL mappings.
- **QR Code Integration:** Quickly generate and share QR codes for your shortened links.
- **Modern UI:** Clean, responsive vanilla HTML/JS/CSS frontend.

## Prerequisites
- [Deno](https://deno.land/) (v1.35 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sumitarora2904/webshortener.git
   cd webshortener
   ```

2. **Environment Configuration:**
   Rename the sample environment file and add your MongoDB connection URI:
   ```bash
   cp .env.sample .env
   ```
   *Edit `.env` and set `MONGO_URL=your_mongodb_connection_string`.*

3. **Run the Server:**
   Start the application with Deno, granting the necessary permissions:
   ```bash
   deno run --allow-net --allow-read --allow-env api/main.ts
   ```

4. **Access the Application:**
   Open your web browser and navigate to `http://localhost:8000`.

## Architecture Overview
- `/api/main.ts`: The main entry point and HTTP routing utilizing native Deno APIs.
- `/api/database.ts`: Handles the MongoDB connection pool and database operations.
- `/public/`: Contains static assets served to the client (`index.html`, `styles.css`, `script.js`).

## Credits & Acknowledgments
This repository is a modified version of the original WebShortener project. All credit and immense appreciation go to the original author for the foundational code, concept, and design.

*Current modifications and maintenance by [sumitarora2904](https://github.com/sumitarora2904/webshortener).*

## License
This project is licensed under the terms specified in the `LICENSE` file.
