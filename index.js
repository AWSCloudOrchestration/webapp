import app from './api/app.js';
import { initSqlConn } from './db/sql/index.js';

const port = 8080;

app.listen(port, async () => {
    await initSqlConn();
	console.log('Server listening on port', port);
});
