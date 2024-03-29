import mongoose from "mongoose";

// { Schema, model, connect, connection, models }
if (mongoose.connection.readyState != 1) {
    const login =
        "mongodb+srv://pasty:<password>@eventplanner.cil6rdw.mongodb.net/?retryWrites=true&w=majority".replace(
            "<password>",
            import.meta.env.DB_PASS
        );

    mongoose.connect(login);
}


const ShortURLSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    isImage: Boolean,
    shorten: String
});

export const ShortURLModel = mongoose.models.ShortURL || mongoose.model("ShortURL", ShortURLSchema);