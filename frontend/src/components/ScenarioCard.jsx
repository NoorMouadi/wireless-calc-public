// src/components/ScenarioCard.jsx
import { Link } from 'react-router-dom';

export default function ScenarioCard({ title, path, description }) {
  return (
    <Link
      to={path}
      className="block p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm opacity-80 leading-snug">{description}</p>
    </Link>
  );
}
