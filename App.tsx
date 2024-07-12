import { createClient } from '@supabase/supabase-js';
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
  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });
  const {data: profiles, mutate} = useQuery(
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
    'id, country_code',
    {      
      revalidateTables: [{schema: 'public', table: 'profiles'}, {schema: 'public', table: 'trips'}],
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
      <Text style={styles.title}>Profiles</Text>
      {profiles?.map((profile) => (
        <Text key={profile.id}>{profile.username}</Text>
      ))}
      {profiles === undefined && <ActivityIndicator size="large" color="#0000ff" />}
      <Text style={styles.title}>Trips</Text>
      {trips?.map((trip) => (
        <Text key={trip.id}>{trip.country_code}</Text>
      ))}
      {trips === undefined && <ActivityIndicator size="large" color="#0000ff" />}
      <Button title="Mutate" onPress={() => {
        const randomCountryCode = Math.random().toString(36).substring(2, 5).toUpperCase();
        update({id: 1, country_code: randomCountryCode});
      }} />
      <Text>Render Count: {renderCount.current}</Text>
      <Text>Profiles Undefined Count: {profilesUndefinedCount.current}</Text>
      <Text>Trips Undefined Count: {tripsUndefinedCount.current}</Text>
      <StatusBar style="auto" />
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
