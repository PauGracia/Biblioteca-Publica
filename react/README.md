# Biblioteca Maricarmen

Welcome to the project! This is a project built with **React** and **Vite**.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/) (optional)

## Steps to Set Up the Project

### 1. Clone the Repository

First, clone this repository to your local machine. Open a terminal and run:

```bash
git clone https://github.com/lean051082/biblioteca-maricarmen-react.git
```

### 2. Install Dependencies

Navigate to the project folder:

```bash
cd your-repository
```

Then, install the required dependencies. You can use npm or Yarn:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Run the Project

Once the dependencies are installed, you can start the development server. Run:

```bash
npm run dev
```

or

```bash
yarn dev
```

This will start the Vite development server. By default, the project will be available at:

```
http://localhost:5173
```

Open your browser and visit this URL to see the project in action.

### 4. Build for Production

If you want to generate an optimized production build, run:

```bash
npm run build
```

or

```bash
yarn build
```

This will create a `dist` folder with the files ready to be deployed.

### 5. Serve the Production Build

To test the production build locally, you can use a static server. If you don't have one installed, you can use `serve`:

```bash
npm install -g serve
```

Then, serve the `dist` folder:

```bash
serve -s dist
```

The project will be available at `http://localhost:3000` (or another port if 3000 is occupied).

## Project Structure

- `src/`: Contains the project source code.
  - `main.jsx`: Entry point of the application.
  - `App.jsx`: Main application component.
  - `assets/`: Folder for images, fonts, etc.
  - `components/`: Folder for reusable components.
- `public/`: Contains static files that are copied directly to the `dist` folder.
- `vite.config.js`: Vite configuration file.

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for visiting this project! If you have any questions, feel free to open an issue or contact me.

```

```
