import express from "express";

const app = express();

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is listening on port 3000`)
})

export {app}

