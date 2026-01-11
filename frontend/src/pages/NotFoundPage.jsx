import { Link } from "react-router-dom";
import Button from "../components/common/Button";

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold text-secondary-900 mb-4">
        Page non trouvée
      </h1>
      <p className="text-xl text-secondary-600 mb-8 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
