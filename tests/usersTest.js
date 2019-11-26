mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const ObsSchema = mongoose.Schema({
	title: String,
	content: String
});	

const Obs = mongoose.model('Ob', ObsSchema);

const userSchema = mongoose.Schema({
    nome: String,
    email: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Ob'
        }
    ]
})

const User = mongoose.model('User', userSchema);

/* //1. Create the user
User.create({
    nome: 'Bob',
    email:'bob@gmail.com'
})
 */

/* //2. Create a post
Obs.create({
    title: 'tomato, potato, banana',
    content: "There's never too much spicy"
});
 */

/* //3. Create a post and associate to the user
Obs.create({title:'the triangle of horror 2',
            content:'Theres gotta be a better way!'}, async (err, obs) => {
    try{
        await User.findOne({nome:'Bob'}, (err, foundUser) =>{
            if(err){
                console.log('err1',err);
            } else {
                console.log(foundUser);
                foundUser.posts.push(obs);
                foundUser.save((err, data) =>{
                    if(err){
                        console.log('err2',err);
                    } else {
                        console.log(data);
                    }
                });
            }
        });
    } catch(error) {
        console.log('catch error',error);
    }
}); */

//4. Find user with all his posts
User.findOne({nome:'Bob'}).populate('posts').exec((err, user) => {
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});

    
        