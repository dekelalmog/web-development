import init from "./app";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
import https from 'https';
import http from 'http';

init().then((app) => {
  const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Travelerapp",
                version: "1.0.0",
                description: "Travelerapp API Routes",
            },
            servers: [{url: "http://localhost:3000/",}],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);

    app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
    app.listen(process.env.PORT, () => {
      console.log(
        "Example app listening at http://localhost:" + process.env.PORT
      );
    });
});