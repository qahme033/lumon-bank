// scripts/start-bank.ts
import {PSD2Server} from '@banking-sim/psd2-api';
import {AuthServer} from '@banking-sim/auth-service';
import  {AdminServer}  from '@banking-sim/admin-api';
import  {seedBankData}  from '@banking-sim/core-banking';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const bankName = args.name || 'default-bank';
const psd2Port = parseInt(args.port || '3000');
const adminPort = psd2Port + 1000; // Admin port is PSD2 port + 1000

// Seed data for this bank
seedBankData(bankName);

// Start the PSD2 API server
const psd2Server = new PSD2Server(bankName, psd2Port);
psd2Server.start();

// Start the Admin API server
const adminServer = new AdminServer(bankName, adminPort);
adminServer.start();



console.log(`Bank "${bankName}" started with:`);
console.log(`- PSD2 API on port ${psd2Port}`);
console.log(`- Admin API on port ${adminPort}`);
