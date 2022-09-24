const { app } = require('./app');

// DB
const { db } = require('./utils/db.utils');
const { initModel } = require('./models/initModel');

const startServer = async () => {
  try {
    await db.authenticate();

    //* Establish relation between models
    initModel();

    await db.sync();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`AcademloMeals Server is Running!!! on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
