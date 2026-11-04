const { spawn, execSync } = require('child_process');
const path = require('path');
const newman = require('newman');

async function run() {
  console.log('Cleaning database...');
  execSync('node scripts/clean-db.js', { stdio: 'inherit' });

  console.log('Starting API server...');
  const server = spawn('node', ['src/server.js'], { stdio: 'inherit', shell: true });
  server.on('error', (err) => console.error('Server process error:', err));
  server.on('exit', (code, sig) => console.log(`Server exited with code ${code}, signal ${sig}`));

  await new Promise(resolve => setTimeout(resolve, 3000));

  const collectionPath = path.resolve('OpenJob RESTful API V2 Test/[271] OpenJob API Test V2.postman_collection.json');
  const environmentPath = path.resolve('OpenJob RESTful API V2 Test/OpenJob API.postman_environment.json');

  const collection = require(collectionPath);
  const environment = require(environmentPath);

  const runnableItems = collection.item.filter(item => item.name !== '[Mandatory] Documents');
  const runnableCollection = { ...collection, item: runnableItems };

  console.log('Running Newman for folders:');
  runnableItems.forEach((it, idx) => console.log(`  ${idx + 1}. ${it.name}`));

  newman.run({
    collection: runnableCollection,
    environment,
    reporters: 'cli',
    reporter: {
      cli: {
        noSummary: false,
        noFailures: false,
      }
    }
  }, (err, summary) => {
    try {
      server.kill();
    } catch (_) {}

    if (err) {
      console.error('Newman execution error:', err);
      process.exit(1);
    }

    const failures = summary.run.failures;
    console.log('\n======================================================');
    console.log(`TOTAL REQUESTS: ${summary.run.stats.requests.total}`);
    console.log(`PASSED: ${summary.run.stats.assertions.total - summary.run.stats.assertions.failed}`);
    console.log(`FAILED ASSERTIONS: ${summary.run.stats.assertions.failed}`);
    console.log(`TOTAL FAILURES: ${failures.length}`);
    console.log('======================================================\n');

    if (failures.length > 0) {
      failures.forEach((f, idx) => {
        console.log(`Failure ${idx + 1}: [${f.source.name}]`);
        console.log(`  Assertion: ${f.error.test}`);
        console.log(`  Message: ${f.error.message}\n`);
      });
      process.exit(1);
    } else {
      console.log('ALL TESTS IN V2 COLLECTION PASSED (100%)!');
      process.exit(0);
    }
  });
}

run().catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
