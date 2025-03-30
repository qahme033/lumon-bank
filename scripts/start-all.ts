// scripts/start-all.ts
import { AuthServer } from '@banking-sim/auth-service';
import { PSD2Server } from '@banking-sim/psd2-api';
import { AdminServer } from '@banking-sim/admin-api';
import minimist from 'minimist';
import  {seedBankData}  from '@banking-sim/core-banking';

const args = minimist(process.argv.slice(2));
const bankName = args.name || 'default-bank';
const basePort = parseInt(args.port || '3000');

seedBankData(bankName);

// Start the Auth server
const authServer = new AuthServer(basePort);
authServer.start();

// Start the PSD2 API server
const psd2Server = new PSD2Server(bankName, basePort + 1);
psd2Server.start();

// Start the Admin API server
const adminServer = new AdminServer(bankName, basePort + 2);
adminServer.start();

console.log(`
Banking Simulation Started:
- Bank Name: ${bankName}
- Auth Server: http://localhost:${basePort}
- PSD2 API: http://localhost:${basePort + 1}
- Admin API: http://localhost:${basePort + 2}
`);
