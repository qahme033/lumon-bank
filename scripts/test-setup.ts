// scripts/test-setup.ts
import { testPSD2API } from '@banking-sim/psd2-api';
import { testAdminAPI } from '@banking-sim/admin-api';

console.log('=== BANKING SIMULATION SETUP TEST ===');
console.log('PSD2 API Test:', testPSD2API());
console.log('Admin API Test:', testAdminAPI());
console.log('=== TEST COMPLETE ===');