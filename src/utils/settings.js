import dotenv from "dotenv";
dotenv.config();


function getEnvVariable(key) {
    const value = process.env[key || " "];
    if (!value) {
        throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return value;
}

const Settings = {
    PORT: getEnvVariable("PORT")
};

export default Settings;