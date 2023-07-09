export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  // database: {
  //   host: process.env.DATABASE_HOST,
  //   port: parseInt(process.env.DATABASE_PORT ?? '27017', 10) || 5432
  // },
  mongodb: {
    // should use env
    host: process.env.MONGO_DB_HOST ?? '127.0.0.1',
    database: process.env.MONGO_DB_DATABASE ?? 'task-board',
    port: process.env.MONGO_DB_PORT ?? '27017',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY ?? 'b2Oa%qKZ,GW]S+d',
  }
});