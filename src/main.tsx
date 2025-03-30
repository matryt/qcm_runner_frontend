import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import QuizPage from "./components/quizzes/QuizPage.tsx";
import "./index.css";
import Home from "./components/Home.tsx";
import DownloadPage from "./components/downloads/DownloadPage.tsx";

const router = createBrowserRouter([
    {
        path: "/quiz",
        Component: QuizPage,
    },
    {
        path: '/',
        Component: Home
    },
    {
        path: '/download',
        Component: DownloadPage
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);
