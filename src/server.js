import express from "express";
const PORT = process.env.PORT || 3000;
function setupServer() {
    const app = express();

    app.get("/", (req, res) => {
        res.send("Success");
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${ PORT }`);
    });
}
setupServer();
