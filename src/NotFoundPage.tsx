import { Link } from 'react-router-dom';


export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-9xl font-bold text-gray-100">404</h1>
        <h2 className="text-2xl font-bold text-gray-100">Page Not Found</h2>
        <Link to="/" className="text-2xl font-bold text-gray-100 hover:text-rose-500">Go back to Home</Link>
        </div>
    )
}