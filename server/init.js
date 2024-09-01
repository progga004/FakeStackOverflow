// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.


/****************COMMAND LINE************ */
const bcrypt = require('bcrypt');

// userArgs [username] [password]
let userArgs = process.argv.slice(2);

if (userArgs.length === 0) {
  console.log('Please provide admin credentials.');
  return
} else if (userArgs[0] !== 'kam') {
  console.log('Incorrect admin username.');
  return
} else if (userArgs[1] !== 'progga') {
  console.log('Incorrect password.');
  return 
}
// importing the models 
let Answer = require('./models/answers');
let Comment = require('./models/comments');
let Question = require('./models/questions');
let Tag = require('./models/tags');
let User = require('./models/users');

// importing mongoose
let mongoose = require('mongoose');

// connect to the database
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let connection = mongoose.connection;
// Function to create tags
function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, questionId) {
  const answerData = {
      text: text,
      ans_by: ans_by,
      question: questionId
  };

  const newAnswer = new Answer(answerData);

  return newAnswer.save();
}




function commentCreate(content, createdBy, createdAt, votes, commentableId, onModel) {
  const commentDetail = { content };

  if (createdBy) commentDetail.createdBy = createdBy;
  if (createdAt) commentDetail.createdAt = createdAt;
  if (votes) commentDetail.votes = votes;
  if (commentableId) commentDetail.commentableId = commentableId;
  if (onModel) commentDetail.onModel = onModel;

  const comment = new Comment(commentDetail);

  // Save the comment to the database
  return comment.save();
}

function questionCreate(title, text, summary, tags, answers, asked_by, ask_date_time, views, votes) {
  const questionDetail = {
    title: title,
    text: text,
    summary: summary,
    asked_by: asked_by
  };

  if (tags) questionDetail.tags = tags;
  if (answers) questionDetail.answers = answers;
  if (ask_date_time) questionDetail.ask_date_time = ask_date_time;
  if (views) questionDetail.views = views;
  if (votes) questionDetail.votes = votes;

  const question = new Question(questionDetail);

  // Save the question to the database
  return question.save();
}



// function createUser(username, email, password,isAdmin = false) {
//   const newUser = new User({
//     username,
//     email,
//     password,
//     isAdmin,
//     votedOn: [], // Initialize votedOn as an empty array for the new user
//   });

//   // Save the user to the database
//   return newUser.save();
// }
function createUser(username, email, password, isAdmin = false, reputation) {
  return bcrypt.hash(password, 10)  // Hash the password
    .then(hashedPassword => {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,  // Store the hashed password
        isAdmin,
        reputation,
        votedOn: []
      });
      return newUser.save();
    });
}



const populateUsersAndData = async () => {
  try {
    // Create users
    let user1 = await createUser('john_doe', 'john@example.com', 'secure_passwsord', false, 0);
    let user2 = await createUser('jane_smith', 'jane@example.com', 'another_secure_password',false, 50);
    let user3 = await createUser('world_beast', 'world@example.com', 'happy123!', false, 20);
    let user4 = await createUser('messie', 'messie@example.com', 'sweet123!',false,  50);
    let admin = await createUser('kam', 'cse316@stonybrook.edu','progga',true, 200);
    // Create tags
    let tag1 = await tagCreate('react');
    let tag2 = await tagCreate('javascript');
    let tag3 = await tagCreate('android');
    let tag4 = await tagCreate('shared');
    let tag5 = await tagCreate('axios');
    let tag6 = await tagCreate('next.js');
    let tag7 = await tagCreate('mongoDB');


    // Create questions
    let question1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', 'Summary for the first question', [tag1, tag2], [], user1, false, false, 0);
    let question2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time I switch to a different view. I just hide/show my fragments depending on the icon selected. The problem I am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what I am using to refrain them from being recreated.', 'Summary for the second question', [tag3, tag4, tag2], [], user2, null, null, 121);
    let question3 = await questionCreate('what do I use axios for?  next.js compatable with mongoDB?', 'I dont know when and where to use axios and I am trying to use it with mongoDB . I thought next.js would help', 'How to use next.js with axios and mongoDB', [tag5, tag6, tag7], [], user3, null, null, 20);
    let question4 = await questionCreate('what do I use MongoDB for?', 'I am trying to build a notion clone and I can visualize how to put my document into place.', 'noSQL or SQL with clone of notion', [tag2, tag7], [], user3, null, null, 0);

    // Save questions before referencing them in answers
    await question1.save();
    await question2.save();
    await question3.save();
    await question4.save();

   // Create answers
let answer1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', user1, question1);
let answer2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', user2, question1);
let answer3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', user1, question2);
let answer4 = await answerCreate('YourPreference yourPreference = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', user2, question2);

// Save question references in answer5 after question1 and question2 are saved
let answer5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', user1, question2);
let answer6 = await answerCreate('well next.js is a framework? think of next.js as a react just completely different they have pros and cons', user4, question3);
let answer7 = await answerCreate('MongoDB does better with transactions and networks like a twitter. Anyone with a brain knows that', user3, question4);

    // Update questions with references to answers
    question1.answers.push(answer1);
    question1.answers.push(answer2);

    await question1.save();

    question2.answers.push(answer3);
    question2.answers.push(answer4);
    question2.answers.push(answer5);

    await question2.save();

    
    question3.answers.push(answer6);
    await question3.save();

    question4.answers.push(answer7);
    await question4.save();
   
    // answer1.question.push(question1)
    // answer2.question.push(question1)
    // answer3.question.push(question2)
    // answer4.question.push(question2)
    // answer5.question.push([question1, question2])
    // Create comments
    let comment1 = await commentCreate('This is a great question!', user1, false, 5, question1, 'Question');
    let comment2 = await commentCreate('I faced a similar issue before, and here\'s how I solved it...', user2, false, 3, answer1, 'Answer');
    let comment3 = await commentCreate('Could you please provide more details?', user1, false, 1, question2, 'Question');
    let comment4 = await commentCreate('I hope this helps!', user2, false, 2, answer3, 'Answer');

  // Update user votedOn field
  user1.votedOn.push({ itemId: question1._id, itemType: 'question', voteType: 'upvote' });
  user2.votedOn.push({ itemId: answer1._id, itemType: 'answer', voteType: 'downvote' });

  // Save user changes to the database
  await user1.save();
  await user2.save();
    if (connection) connection.close();
    console.log('done');
  } catch (err) {
    console.log('ERROR: ' + err);
    if (connection) connection.close();
  }
}



populateUsersAndData()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if (connection) connection.close();
  });

console.log('processing ...');