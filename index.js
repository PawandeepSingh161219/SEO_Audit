import http from "http";
import  Settings  from "./src/utils/settings.js";
import app from "./app.js";

const server= http.createServer(app);
const PORT = Settings.PORT || 8000;
server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})