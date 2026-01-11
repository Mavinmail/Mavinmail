import { useState, useEffect } from 'react';
import { User, Mail, Clock, LogOut, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getUserStats, getConnectionStatus } from '../services/api';

interface ProfileScreenProps {
  onLogout: () => void;
}

interface StatsData {
  emailsToday: number;
  totalEmails: number;
  timeSavedMinutes: number;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [connection, setConnection] = useState<{ isConnected: boolean; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const [statsData, connectionData] = await Promise.all([
        getUserStats(),
        getConnectionStatus()
      ]);
      setStats(statsData); // Assuming statsData is now directly the StatsData object, not { success: true, stats: { ... } }
      setConnection(connectionData);
    } catch (err: any) {
      console.error('Failed to load profile data:', err);
      setError(err.message || 'Failed to load profile data. Check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatInitial = (email?: string) => {
    return email ? email[0].toUpperCase() : 'U';
  };

  const formatTimeSaved = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    return `${(minutes / 60).toFixed(1)} hrs`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#121212] p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1E1E1E] animate-pulse" />
        <div className="h-6 w-32 bg-[#1E1E1E] rounded animate-pulse" />
        <div className="w-full h-32 bg-[#1E1E1E] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#121212] text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-[#1E1E1E]/50 p-4 backdrop-blur-md">
        <h1 className="text-lg font-semibold tracking-tight">Profile</h1>
        <button
          onClick={fetchData}
          className="p-2 hover:bg-[#262626] rounded-full transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-500">Error Loading Data</h3>
              <p className="text-xs text-red-400 mt-1">{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 text-xs font-medium text-red-400 hover:text-red-300 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2C2C2C] flex items-center justify-center text-[#22d3ee] font-bold text-lg border border-gray-700">
            {connection?.email ? formatInitial(connection.email) : <User className="w-6 h-6" />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-200">{connection?.email || 'Mavin User'}</span>
            <span className="text-xs text-gray-500 bg-[#2C2C2C] px-2 py-0.5 rounded-full w-fit mt-1 border border-gray-700 flex items-center gap-1">
              Free Plan
            </span>
          </div>
        </div>

        {/* Usage Stats Card */}
        <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Stats</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-[#262626] rounded-md border border-[#333] text-center">
              <span className="text-lg font-bold text-white leading-tight">{stats?.emailsToday || 0}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wide mt-1 leading-tight">Today</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#262626] rounded-md border border-[#333] text-center">
              <span className="text-lg font-bold text-white leading-tight">{stats?.totalEmails || 0}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wide mt-1 leading-tight">Total</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-[#262626] rounded-md border border-[#333] text-center">
              <span className="text-lg font-bold text-white leading-tight">
                {stats?.timeSavedMinutes ? formatTimeSaved(stats.timeSavedMinutes).split(' ')[0] : '0'}
                <span className="text-[10px] font-normal text-gray-400 ml-0.5">{stats?.timeSavedMinutes && 'm'}</span>
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wide mt-1 leading-tight">Saved</span>
            </div>
          </div>
        </div>

        {/* Account Status & Logout */}
        <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 space-y-4">
          {/* Connected Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Gmail Connection</span>
            </div>
            {connection?.isConnected ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Inactive
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 my-2"></div>

          <button
            onClick={onLogout}
            className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-900/50 py-2 rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}