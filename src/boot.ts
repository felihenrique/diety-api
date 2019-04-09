import server from './server';

(async function() {
    const app = await server;
    app.listen(3000, "0.0.0.0");
    console.log("App running on port 3000");
})();
