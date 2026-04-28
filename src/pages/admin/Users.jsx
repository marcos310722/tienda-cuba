import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import {
  Loader2, UserX, Shield, Key, Save, X, AlertCircle,
  Search, Filter, RefreshCw
} from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { register: regPass, handleSubmit: handleSubmitPass, reset: resetPass, watch } = useForm({
    defaultValues: { newPassword: '', confirmPassword: '' }
  });
  const newPassword = watch('newPassword', '');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_users');
      if (error) throw error;
      
      // Mapear datos para asegurar nombres de claves correctos
      const mappedData = data ? data.map(u => ({
        id: u.uid,
        email: u.u_email,
        full_name: u.full_name,
        phone: u.phone,
        role: u.user_role,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at
      })) : [];
      
      setUsers(mappedData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar usuarios: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    resetPass();
    setMessage({ type: '', text: '' });
    setShowPasswordModal(true);
  };

  const onChangePassword = async (data) => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: result, error } = await supabase.rpc('admin_update_user_password', {
        user_email: selectedUser.email,
        new_password: data.newPassword
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      setMessage({ type: 'success', text: `✅ Contraseña de ${selectedUser.email} actualizada` });
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setSelectedUser(null);
        resetPass();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.email.toLowerCase().includes(search.toLowerCase()) ||
                       (user.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer' || !u.role).length,
    active: users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(Date.now() - 30*24*60*60*1000)).length
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cuba-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <button onClick={fetchUsers} className="btn btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400">Total Usuarios</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
        </div>
        <div className="card bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
          <p className="text-sm text-purple-600 dark:text-purple-400">Administradores</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.admins}</p>
        </div>
        <div className="card bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">Clientes</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.customers}</p>
        </div>
        <div className="card bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <p className="text-sm text-amber-600 dark:text-amber-400">Activos (30 días)</p>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.active}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input md:w-48"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="customer">Clientes</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
            <tr>
              <th className="p-3 text-gray-700 dark:text-slate-200">Email</th>
              <th className="p-3 text-gray-700 dark:text-slate-200">Nombre</th>
              <th className="p-3 text-gray-700 dark:text-slate-200">Teléfono</th>
              <th className="p-3 text-gray-700 dark:text-slate-200">Rol</th>
              <th className="p-3 text-gray-700 dark:text-slate-200">Último acceso</th>
              <th className="p-3 text-gray-700 dark:text-slate-200">Registro</th>
              <th className="p-3 text-gray-700 dark:text-slate-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="p-3 font-medium text-gray-900 dark:text-slate-100">{user.email}</td>
                <td className="p-3 text-gray-900 dark:text-slate-100">{user.full_name || '-'}</td>
                <td className="p-3 text-gray-900 dark:text-slate-100">{user.phone || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.role === 'admin' ? <><Shield className="w-3 h-3 inline mr-1" />Admin</> : 'Cliente'}
                  </span>
                </td>
                <td className="p-3 text-gray-500 dark:text-slate-400 text-xs">
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('es-CU') : 'Nunca'}
                </td>
                <td className="p-3 text-gray-500 dark:text-slate-400 text-xs">
                  {new Date(user.created_at).toLocaleDateString('es-CU')}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => openPasswordModal(user)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded flex items-center gap-1 text-xs transition-colors"
                  >
                    <Key className="w-4 h-4" /> Cambiar contraseña
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-slate-400">
                  <UserX className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cuba-600 dark:text-cuba-400" />
                Cambiar Contraseña
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-1 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-200">Usuario: <strong>{selectedUser.email}</strong></span>
              <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
                La contraseña se actualizará inmediatamente. Notifica al usuario por WhatsApp/Telegram.
              </p>
            </div>

            <form onSubmit={handleSubmitPass(onChangePassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  {...regPass('newPassword', {
                    required: 'Campo obligatorio',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                  })}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  {...regPass('confirmPassword', {
                    required: 'Campo obligatorio',
                    validate: (v) => v === newPassword || 'No coinciden'
                  })}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Actualizar</>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}