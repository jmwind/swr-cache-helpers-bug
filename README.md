Demo app that demonstrates a behavior change between cache-helpers-swr 1.0.9 and 1.7.5.

To run:

1. Clone the repo
2. Run `npm install`
3. Run typical local supabase setup `supabase start`. The repo has migrations and seed files to get the DB setup.
4. Run `supabase status` and grab anon key and paste in App.tsx.
5. Run `npm run ios` or `npm run android`


Test case:

* The app shows how revalidation works when using the `revalidateTables` option in cache-helpers-swr 1.0.9 vs 1.7.5.
* In 1.7.5, the table is revalidated but the data is invalidated and returns as undefined while the invalidation is still in progress. Even when the cache has the data. The state change for the profiles and trips sample queries from defined to undefined and then back causes unnecessary re-renders.
* In 1.0.9, the behavior of invalidating is correct and the profiles and trips aren't updated until the invalidation is complete and new data is fetched.
* Test by clicking the Refetch button to change the country code for the first profile. The profiles and trips should update without a flicker in the UI (as the underlying data is being fetched from the server and react should diff and update only what has changed). If you switch between 1.0.9 and 1.7.5, you will see the UI flickers in 1.7.5 and not in 1.0.9.