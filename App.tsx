import { createClient, Session } from '@supabase/supabase-js';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { Database } from './sbtypes';
import { useQuery, useUpdateMutation } from '@supabase-cache-helpers/postgrest-swr';
import { useEffect, useRef, useState } from 'react';

const client = createClient<Database>(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
);

export default function App() {
  const renderCount = useRef(0);
  const profilesUndefinedCount = useRef(0);
  const tripsUndefinedCount = useRef(0);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    client.auth.onAuthStateChange((event, session) => {
      console.log('auth state change', event, session?.expires_in, session?.user.email);
      setSession(session);
    });    
    const interval = setInterval(() => {
      client.auth.getSession().then(({data: {session}}) => {
        console.log('session', session?.user.email);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });
  const {data: profiles, mutate, error} = useQuery(
    client.from('profiles').select('id, full_name, username').order('id', {ascending: false}),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );
  const {data: trips} = useQuery(
    client.from('trips').select('id, country_code').order('id', {ascending: false}),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );
  const { trigger: update } = useUpdateMutation(
    client.from('trips'),
    ['id'],
    'id',
    {      
      revalidateTables: [{schema: 'public', table: 'profiles'}],
    }
  );
  useEffect(() => {
    if (profiles === undefined) {
      profilesUndefinedCount.current = profilesUndefinedCount.current + 1;
    }
  }, [profiles]);

  useEffect(() => {
    if (trips === undefined) {
      tripsUndefinedCount.current = tripsUndefinedCount.current + 1;
    }
  }, [trips]);
  return (
    <View style={styles.container}>
      {error && <Text>Error: {error.message}</Text>}
      <Text style={styles.title}>Profiles</Text>      
      {profiles?.map((profile) => (
        <Text key={profile.id}>{profile.username}</Text>
      ))}
      {profiles === undefined && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.title}>Trips</Text>
      {trips?.map((trip) => (
        <Text key={trip.id}>{trip.country_code} - {trip.id}</Text>
      ))}
      {trips === undefined && <ActivityIndicator size="large" color="#0000ff" />}
      <Button title="Mutate" onPress={() => {
        let randomCountryCode = Math.random().toString(36).substring(2, 5).toUpperCase();
        update({id: 5, country_code: randomCountryCode});
      }} />
      <Button title="Signin" onPress={async () => {
        const {data, error} = await client.auth.signInWithPassword({email: 'admin@demo.com', password: 'demo'}); 
        if (error) {
          console.log('error', error);
        } else {
          console.log('signed in', data.user.email);
        }      
      }} />
      <Button title="Signout" onPress={() => {
        client.auth.signOut();
      }} />
      <Text>Render Count: {renderCount.current}</Text>
      <Text>Profiles Undefined Count: {profilesUndefinedCount.current}</Text>
      <Text>Trips Undefined Count: {tripsUndefinedCount.current}</Text>
      <Text>Session: {session?.user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
