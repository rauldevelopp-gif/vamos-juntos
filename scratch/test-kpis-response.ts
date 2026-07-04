async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/kpis');
    const data = await res.json();
    console.log('API Status:', res.status);
    console.log('API Success:', data.success);
    console.log('API keys in data:', Object.keys(data.data || {}));
    if (data.data && data.data.history) {
      console.log('History length:', data.data.history.length);
      console.log('Sample history item:', data.data.history[0]);
    } else {
      console.log('No history found!');
    }
  } catch (err: any) {
    console.error('Error fetching APIs:', err.message);
  }
}

main();
