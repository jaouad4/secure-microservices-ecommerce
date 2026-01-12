import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🚫</div>
        <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h2>
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
