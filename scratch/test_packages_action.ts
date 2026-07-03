import { getPackages } from '../app/[locale]/admin/package/actions';

async function main() {
  console.log('Calling getPackages()...');
  const result = await getPackages();
  console.log('Result success:', result.success);
  if (result.success && result.data) {
    console.log('Found packages:', result.data.length);
    const testPkg = result.data.find(p => p.name === 'test');
    if (testPkg) {
      console.log('Found "test" package:', JSON.stringify(testPkg, null, 2));
    } else {
      console.log('Could not find package "test". All packages:', result.data.map(p => p.name));
    }
  } else {
    console.log('Error:', result.error);
  }
}

main()
  .catch(console.error);
