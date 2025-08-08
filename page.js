'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      setEmail(user.email || '');

      // load stats
      const { data: statsRows, error: sErr } = await supabase.from('stats').select('*').order('name');
      if (sErr) console.error(sErr);
      setStats(statsRows || []);

      // load user stat values
      const { data: us, error: uErr } = await supabase.from('user_stats').select('*');
      if (uErr) console.error(uErr);
      const map = {};
      (us || []).forEach(r => { map[r.stat_id] = r.value; });
      setUserStats(map);

      setLoading(false);
    })();
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
        <h2>Dashboard</h2>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ opacity:0.8, fontSize:12 }}>{email}</span>
          <button onClick={signOut} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #2a3240', background: '#121820', color: 'white' }}>Sign out</button>
        </div>
      </div>
      <div style={{ display:'grid', gap:12 }}>
        {stats.map(stat => {
          const val = userStats[stat.id] ?? 0;
          return (
            <div key={stat.id} style={{ background:'#0f141b', border:'1px solid #2a3240', borderRadius:10, padding:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <strong>{stat.name} {stat.icon || ''}</strong>
                <span style={{ opacity:0.8 }}>{val}</span>
              </div>
              <div style={{ height:10, background:'#1b2430', borderRadius:6, overflow:'hidden' }}>
                <div style={{ width: `${Math.min(val,100)}%`, height:'100%', background: stat.color || '#3b82f6' }} />
              </div>
              <div style={{ opacity:0.7, marginTop:6, fontSize:12 }}>{stat.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
