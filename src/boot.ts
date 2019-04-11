import server from './server';
import { createConnection } from 'typeorm';

(async function() {
    await createConnection();
    server.listen(3000, "0.0.0.0", () => console.log("App running on port 3000"));
})();
