import { useRouter } from 'next/router';

const RedirectButton = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/daily-tracker');
  };

  return (
    <button
      onClick={handleRedirect}
      className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <span className="relative z-10">Go to Daily Tracker</span>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};

export default RedirectButton; 