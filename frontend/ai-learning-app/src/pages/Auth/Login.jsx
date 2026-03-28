import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Authservices from '../../services/Authservices';
import {BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const {token, user} = await Authservices.login(email, password);
      login(user, token);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    }catch (err) {
      setError(err.message || 'failed to login. please check your credentials.');
      toast.error(err.message || 'failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-slate-50 via-white to-slate-50">
    
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

    <div className="relative w-full max-w-md px-6">
      
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-6">
        
        {/* header */}
        <div className="text-center mb-6">
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-6">
            <BrainCircuit className='w-7 h-7 text-white' strokeWidth={2}/>
          </div>

          <h1 className='text-2xl font-bold text-slate-800 capitalize'>
           welcome back
          </h1>

          <p className='text-sm text-slate-500 mt-2'>
            sign in to continue your journey
          </p>

        </div>

        {/*form */}
        <div className="space-y-4">
          
          {/*email field */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-slate-600'>
              Email
            </label>

            <div className="relative">
              
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
              }`}>
                <Mail className='w-5 h-5' strokeWidth={2}/>
              </div>

              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={()=> setFocusedField('email')}
                onBlur={()=> setFocusedField(null)}
                className='w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                placeholder='your@example.com'
              />

            </div>
          </div>

          {/*password */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-slate-600'>
              password
            </label>

            <div className="relative">
              
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
              }`}>
                <Lock className="w-5 h-5" strokeWidth={2} />
              </div>

              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={()=> setFocusedField('password')}
                onBlur={()=> setFocusedField(null)}
                className='w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                placeholder='•••••••'
              />

            </div>
          </div>

          {/* error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className='text-sm text-red-500'>{error}</p>
            </div>
          )}

          {/* submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70'
          > 
            <span className='flex items-center gap-2'>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  signing in...
                </>
              ) : (
                <>
                  sign in
                  <ArrowRight className='w-5 h-5' strokeWidth={2.5}/>
                </>
              )}
            </span>
          </button>

        </div>

        {/*footer*/}
        <div className="mt-3 text-center">
          <p className='text-sm text-slate-500'>
            Don't have an account?{' '}
            <Link to='/register' className='text-emerald-600 font-medium hover:underline'>
              sign up
            </Link>
          </p>
        </div>

      </div>

      {/* subtle footer text */}
      <p className='text-center text-xs text-slate-400 mt-6'>
        By continuing, you agree to our terms & privacy policy
      </p>

    </div>
   </div>
  )
}

export default Login;