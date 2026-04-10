import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username : {type : String, required : true},
    fullName : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    booksmarkedpolls : [{type : mongoose.Schema.Types.ObjectId, ref : 'Poll'}],
}, {timestamps : true});

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    return;
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;