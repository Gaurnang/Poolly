import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    optionText: { type: String },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const PollSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        type: {
            type: String,
            enum: ['single-choice', 'yes/no', 'rating', 'open-ended'],
            required: true,
        },
        options: [OptionSchema],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        responses: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                optionIndex: { type: Number },
                rating: { type: Number },
                text: { type: String },
                votedAt: { type: Date, default: Date.now },
            },
        ],
        isClosed: { type: Boolean, default: false },
        closedAt: { type: Date },
        tags: [{ type: String }],
        totalVotes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Poll = mongoose.model('Poll', PollSchema);
export default Poll;
