import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, signInWithGoogle, resetPassword } = useAuth();

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
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
            errorMessage = 'E-mail ou senha inválidos. Por favor, tente novamente.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Já existe uma conta com este e-mail.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca (deve ter pelo menos 6 caracteres).';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O endereço de e-mail não é válido.';
            break;
          default:
            console.error("Firebase Auth Error:", err);
            errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
            break;
        }
      } else {
        console.error("Authentication Error:", err);
        errorMessage = 'Falha na autenticação. Verifique sua conexão e tente novamente.';
      }
      setError(errorMessage);
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      // onAuthStateChanged will handle navigation
    } catch (err: any) {
      console.error("Google Sign-in Error:", err);
      let errorMessage = 'Falha ao entrar com o Google. Tente novamente.';
       if (err.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Login com Google cancelado.';
        } else if (err.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'Já existe uma conta com este e-mail, mas com credenciais diferentes.';
        }
      setError(errorMessage);
    }
    setLoading(false);
  };
  
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Link para redefinição de senha enviado! Verifique seu e-mail (incluindo a caixa de spam).');
      setIsForgotPasswordView(false); // Go back to login view
      setEmail(''); // Clear email field
    } catch (err: any) {
      console.error("Password Reset Error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este e-mail.');
      } else {
        setError('Ocorreu um erro ao enviar o link. Tente novamente.');
      }
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

  const renderForgotPasswordView = () => (
    <>
      <div className="text-center">
        <div className="flex justify-center mb-4">
           <svg className="w-12 h-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
          Redefinir Senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Insira seu e-mail para receber o link de redefinição.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handlePasswordReset}>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md text-sm text-center">{error}</div>}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
          </div>
          <input
            id="email-address-reset" name="email" type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Endereço de e-mail"
          />
        </div>
        <div>
          <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-700 disabled:cursor-not-allowed transition-all">
            {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Enviar Link'}
          </button>
        </div>
      </form>
      <div className="text-sm text-center">
        <button onClick={() => { setIsForgotPasswordView(false); setError(''); setMessage(''); }} className="font-medium text-blue-400 hover:text-blue-300">
          Voltar para o Login
        </button>
      </div>
    </>
  );

  const renderAuthView = () => (
    <>
      <div className="text-center">
        <div className="flex justify-center mb-4"><AuthIcon /></div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">Monetiza IA</h2>
        <p className="mt-2 text-center text-sm text-gray-400">{isLoginView ? 'Acessar sua conta' : 'Criar uma nova conta'}</p>
      </div>
      
      {message && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-md text-sm text-center">{message}</div>}
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md text-sm text-center">{error}</div>}

      <div className="bg-gray-900/50 p-1 rounded-full flex items-center space-x-1">
        <button onClick={() => { setIsLoginView(true); setError(''); setMessage(''); }} className={`w-full py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${isLoginView ? 'bg-blue-600 shadow-md shadow-blue-600/30 text-white' : 'text-gray-400 hover:text-white'}`}>Login</button>
        <button onClick={() => { setIsLoginView(false); setError(''); setMessage(''); }} className={`w-full py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${!isLoginView ? 'bg-blue-600 shadow-md shadow-blue-600/30 text-white' : 'text-gray-400 hover:text-white'}`}>Register</button>
      </div>

      <form className="space-y-6" onSubmit={handleAuthSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg></div>
            <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Endereço de e-mail"/>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Senha"/>
          </div>
        </div>
        {isLoginView && (
          <div className="text-right text-sm">
            <button type="button" onClick={() => { setIsForgotPasswordView(true); setError(''); setMessage(''); }} className="font-medium text-blue-400 hover:text-blue-300">Esqueceu a senha?</button>
          </div>
        )}
        <div>
          <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:from-gray-700 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105">
            {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : (isLoginView ? 'Entrar' : 'Registrar')}
          </button>
        </div>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-black/40 backdrop-blur-sm text-gray-500">OU</span></div>
      </div>
      <div>
        <button onClick={handleGoogleSignIn} disabled={loading} className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_105_1383)"><path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.45H18.02C17.68 15.93 16.8 17.18 15.41 18.06V20.84H19.39C21.48 18.99 22.56 16.03 22.56 12.25Z" fill="#4285F4"></path><path d="M12 23C15.06 23 17.64 22.01 19.39 20.84L15.41 18.06C14.36 18.75 13.25 19.12 12 19.12C9.37 19.12 7.14 17.36 6.3 14.99L2.2 18.01C4.01 21.12 7.72 23 12 23Z" fill="#34A853"></path><path d="M6.3 14.99C6.09 14.41 5.98 13.79 5.98 13.15C5.98 12.51 6.09 11.89 6.3 11.31V8.53L2.2 5.51C1.46 6.99 1 8.8 1 10.85C1 12.9 1.46 14.71 2.2 16.19L6.3 13.52V14.99Z" fill="#FBBC05"></path><path d="M12 5.88C13.38 5.88 14.63 6.35 15.61 7.28L19.48 3.41C17.64 1.74 15.06 0.85 12 0.85C7.72 0.85 4.01 2.88 2.2 5.99L6.3 8.98C7.14 6.61 9.37 5.88 12 5.88Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_105_1383"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
          Entrar com Google
        </button>
      </div>
    </>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png'), linear-gradient(to bottom, #0a0a23, #000000)" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative max-w-md w-full space-y-6 bg-black/40 backdrop-blur-sm border border-blue-500/30 p-8 rounded-2xl shadow-2xl shadow-blue-500/20">
        {isForgotPasswordView ? renderForgotPasswordView() : renderAuthView()}
      </div>
    </div>
  );
};

export default LoginPage;