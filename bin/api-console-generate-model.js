process.title = 'api-console generate-json';

const program = require('commander');
const colors = require('colors/safe');
const generator = require('../lib/generate-json');

var desc = 'Use this command to create a JSON file that is recognizable by the API console ';
desc += 'and its components.\n  You can use the file to optimise loading time of the API console.';

program
  .arguments('<raml>', 'Path to the RAML file. Can be an URL.')
  .usage('\n\n  $ api-console generate-json [options] <raml>')
  .description(desc)
  .option('-o, --output [value]', 'Output file. Default to "./api.json"')
  .option('-p, --pretty-print', 'Generated JSON will be formatted')
  .option('--verbose', 'Print verbose messages')
  .action(function(raml, options) {
    console.log();
    if (!raml) {
      console.log(colors.red('  Source RAML file not specified.'));
      process.exit(1);
      return;
    }
    try {
      const script = new generator.JsonGenerator(raml, options);
      script.run()
      .catch((cause) => {
        console.log(colors.red('  ' + cause.message));
        console.log();
        if (options.verbose) {
          console.log(cause.stack);
          console.log();
        }
        process.exit(1);
      });
    } catch (e) {
      console.log(colors.red('  ' + e.message));
      console.log();
      if (options.verbose) {
        console.log(e.stack);
        console.log();
      }
      process.exit(1);
    }
  })
  .on('--help', function() {
    console.log('\n\n  Examples:');
    console.log();
    console.log('    $ api-console generate-json ./api.raml');
    console.log('    $ api-console generate-json http://domain.com/api.raml');
    console.log('    $ api-console generate-json ./api.raml -o "../api-data.json"');
    console.log();
  })
  .parse(process.argv);
