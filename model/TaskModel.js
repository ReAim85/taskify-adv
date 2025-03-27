import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    done: { type: Boolean, default: false },
    userId: { type: ObjectId, ref: "User" },
    finishBy: { type: Date },
    priority: { type: String, enum:  ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["todo", "inProgress", "underChecking", "done"], default: "todo" },
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);
export default Task;