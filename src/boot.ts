import server from './server';
import { createConnection } from 'typeorm';

(async function() {
    await createConnection();
    console.log("App running on port 3000");
})();
