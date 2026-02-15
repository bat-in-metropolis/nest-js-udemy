export const appConfig = () => ({
    environment: process.env.NODE_ENV || 'prod',
    database: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT ?? "5432", 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        synchronize: process.env.DB_SYNC === 'true' ? true : false,
        autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true' ? true : false,
    }
});