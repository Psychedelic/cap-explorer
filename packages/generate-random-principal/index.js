const { Ed25519KeyIdentity } = require('@dfinity/identity');

const identity = Ed25519KeyIdentity.generate();

const principal = identity.getPrincipal();

process.stdout.write(principal.toText());
