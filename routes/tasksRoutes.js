import express from 'express'
import Task from '../model/TaskModel.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/", protect, async (req, res) => {

    try {
        const { title, description, finishBy, priority, status } = req.body
        const task = await Task.create({
            title,
            description,
            finishBy,
            priority,
            status,
            userId: req.user.id
        }) 
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id })
        res.status(200).json(tasks)
    }catch(err) {
        res.status(500).json({ message: err.message })
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message : "task not found" });

        if(task.userId.toString() !== req.user._id.toString()) 
            return res.status(404).json({ message: "Not authorized" })
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedTask)
    }catch(err) {
        res.status(500).json({ message: err.message })
    } 
});

router.delete("/:id", protect, async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "Task not found"})

        if(task.userId.toString() !== req.user.id) 
            return res.status(404).json({ message: "Not authorized" });

        await task.deleteOne();
        res.status(200).json({ message: "Task deleted"})
        
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
})

export default router