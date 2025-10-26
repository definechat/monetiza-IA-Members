
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      let errorMessage;
      
      if (err.code) {
          switch (err.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                  errorMessage = 'Invalid email or password. Please try again.';
                  // This is a user error, not a bug, so we don't log it to the console.
                  break;
              case 'auth/email-already-in-use':
                  errorMessage = 'An account with this email already exists.';
                  break;
              case 'auth/weak-password':
                  errorMessage = 'Password is too weak (must be at least 6 characters).';
                  break;
              case 'auth/invalid-email':
                  errorMessage = 'The email address is not valid.';
                  break;
              default:
                  console.error("Firebase Auth Error:", err);
                  errorMessage = 'An unexpected error occurred during authentication. Please try again.';
                  break;
          }
      } else {
        // Log non-Firebase or unexpected errors
        console.error("Authentication Error:", err);
        errorMessage = 'Failed to authenticate. Please check your connection and try again.';
      }
      setError(errorMessage);
    }
    setLoading(false);
  };

  const AuthIcon = () => (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" fillOpacity="0.5"/>
      <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
    </svg>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png'), linear-gradient(to bottom, #0a0a23, #000000)" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative max-w-md w-full space-y-8 bg-black/40 backdrop-blur-sm border border-blue-500/30 p-8 rounded-2xl shadow-2xl shadow-blue-500/20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
             <AuthIcon />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
            Monetiza IA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {isLoginView ? 'Acessar sua conta' : 'Criar uma nova conta'}
          </p>
        </div>

        <div className="bg-gray-900/50 p-1 rounded-full flex items-center space-x-1">
          <button
            onClick={() => setIsLoginView(true)}
            className={`w-full py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${isLoginView ? 'bg-blue-600 shadow-md shadow-blue-600/30 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            className={`w-full py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${!isLoginView ? 'bg-blue-600 shadow-md shadow-blue-600/30 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Endereço de e-mail"
              />
            </div>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (isLoginView ? 'Entrar' : 'Registrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
