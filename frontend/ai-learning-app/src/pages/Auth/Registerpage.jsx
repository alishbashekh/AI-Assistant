import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Authservices from '../../services/Authservices';
import {BrainCircuit, Mail, Lock, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Registerpage = () => {
   const [username, setUsername] = useState("")
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [focusedField, setFocusedField] = useState(null);
  
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
     
      if(password.length < 6){
         setError('password must be at least 6 characters long')
         return
      }

      setError('');
      setLoading(true);
      try{
         await Authservices.register(username, email, password);
         toast.success('Registration successful! Please login');
         navigate('/login');
      }catch (err) {
         setError(err.message || 'Failed to register, please check your credentials.');
         toast.error(err.message || 'Failed to register.');
      } finally {
         setLoading(false);
      }
   };

  return (
    <div className="flex items-center justify-center h-screen px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
        
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
    
      <div className="relative w-full max-w-md">
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-5 max-h-[92vh]">
          
          {/* header */}
          <div className="text-center mb-4">
            
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-6">
              <BrainCircuit className='w-7 h-7 text-white' strokeWidth={2}/>
            </div>

            <h1 className='text-2xl font-bold text-slate-800 capitalize'>
              Create an account
            </h1>

            <p className='text-sm text-slate-500 mt-2'>
              Start your AI-powered learning journey
            </p>

          </div>

          {/* form */}
          <div className="space-y-3">
            
            {/* username field */}
            <div className="space-y-2">
              <label className='text-sm font-medium text-slate-600'>
                Username
              </label>

              <div className="relative">
                
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === 'username' ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                  <User className='w-5 h-5' strokeWidth={2}/>
                </div>

                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={()=> setFocusedField('username')}
                  onBlur={()=> setFocusedField(null)}
                  className='w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                  placeholder='yourusername'
                />
              </div>
            </div>

            {/* email field */}
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

            {/* password field */}
            <div className="space-y-2">
              <label className='text-sm font-medium text-slate-600'>
                Password
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
              className='relative group overflow-hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70'
            > 
              <span className='flex items-center gap-2 z-10 relative'>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Creating account ...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className='w-5 h-5' strokeWidth={2.5}/>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"/>
            </button>                     

            {/* footer */}
            <div className="mt-3 text-center">
              <p className='text-sm text-slate-500'>
                Already have an account?{' '}
                <Link to='/login' className='text-emerald-600 font-medium hover:underline'>
                  sign in
                </Link>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Registerpage;