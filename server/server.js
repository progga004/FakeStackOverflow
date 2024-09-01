// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package
const app = express();
const port = 8000;
const questions = require("./models/questions");
const tags = require("./models/tags");
const answers = require("./models/answers");
const users = require("./models/users")
const comments=require("./models/comments")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser=require('cookie-parser')
require('dotenv').config()
//starting the server
app.listen(port, () => {
  console.log('Server is running on port %d', port);
})
// connecting to MongoDB server
mongoose
  .connect('mongodb://127.0.0.1:27017/fake_so')
  .then(res => console.log("connected to MongoDB"))
  .catch(error => console.log(error));

// application must use middleware to accepts json files
app.use(express.json())
app.use(cookieparser())

// Enable CORS with specific origins
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
   // Replace with your React app's origin
}));

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware for user authentication
const authenticateUser = async (req, res, next) => {

  //const token = req.headers.authorization;
  const token = req.cookies['token'];
 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
   req.user = decoded;
      
   
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the email or username already exists
    const existingUser = await users.findOne({ email  });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new users({ email, username, password: hashedPassword });
    await newUser.save();

    // Include user ID in the JWT payload
    const token = jwt.sign({ email: newUser.email, userId: newUser._id }, SECRET_KEY);
    
    // Set the token as an HttpOnly cookie
    res.cookie('token', token, { httpOnly: true });
    
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email,password",email,password)
    // Check if the user exists based on email
    const user = await users.findOne({ email });
    console.log("Am I here",user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Match password",passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Include user ID in the JWT payload
    const token = jwt.sign({ email: user.email, userId: user._id }, SECRET_KEY);
    
    // Set the token as an HttpOnly cookie
    res.cookie('token', token, { httpOnly: true });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // Clear the HttpOnly cookie
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Protected route
app.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'You have access to the protected route!', user: req.user });
});

/* GET METHODS */
// creating a route to get all Question objects
app.get('/getQuestions', async (req, res) => {
  try {
    const Question = await questions.find().populate('tags').populate('answers').populate('asked_by', 'username');
   
    res.status(200).json(Question)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message })
  }
})
// creating route to get total amount of quesiton object 
app.get('/getTotalQuestions', async (req, res) => {
  try {
    const Question = await questions.countDocuments();
    res.status(200).json(Question)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message })
  }
})
//create routes to get the voting number 


app.post('/vote/:itemId', authenticateUser, async (req, res) => {
  const { itemId } = req.params;
  const { voteType, type } = req.body; 
  const userId = req.user.userId;

  try {
      const voter = await users.findById(userId);
      
      if (!voter || voter.reputation < 50) {
          return res.status(200).json({ message: "Insufficient reputation to vote" });
      }

      let item;
      let author;
      if (type === 'question') {
          item = await questions.findById(itemId).populate('asked_by');
          author = item.asked_by;
      } else if (type === 'answer') {
          item = await answers.findById(itemId).populate('ans_by');
          author = item.ans_by;
      } else {
          return res.status(400).json({ message: 'Invalid vote type' });
      }

      if (!item) {
          return res.status(404).json({ message: 'Item not found' });
      }

      
      let existingVote = voter.votedOn.find(vote => vote.itemId.toString() === itemId.toString() && vote.itemType === type);

      console.log("Existing vote",existingVote);
        if (existingVote) {
            if (existingVote.voteType === voteType) {
                return res.status(200).json({ message: "Already voted", votes: item.votes });
            } else {
                // Reverse previous vote
                item.votes += (existingVote.voteType === 'upvote' ? -1 : 1);
        // Apply new vote, but only increase if it's an upvote
          if (voteType === 'upvote') {
            item.votes += 1;
        }
        existingVote.voteType = voteType;
            }
        } else {
            // First-time voting
            item.votes += (voteType === 'upvote' ? 1 : -1);
            // Updated to include itemType
            voter.votedOn.push({ itemId: itemId, itemType: type, voteType: voteType });
        }

      // Ensure votes don't go negative
      item.votes = Math.max(0, item.votes);

      // Update reputation
      if (author && author._id.toString() !== userId) {
          const reputationChange = voteType === 'upvote' ? 5 : -10;
          author.reputation = Math.max(0, author.reputation + reputationChange);
          await author.save();
      }

      await item.save();
      await voter.save();

      res.json({ votes: item.votes, userReputation: voter.reputation });
  } catch (error) {
      console.error('Error in voting:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});





// creating route to get all tag objects
app.get('/getTags', async (req, res) => {
  try {
    const Tags = await tags.find();
    res.status(200).json(Tags);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
})
app.get('/getTotalTags', async (req, res) => {
  try {
    const count = await tags.countDocuments();
    res.status(200).json({ totalTags: count });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
})


app.get('/getAnswers/:questionId',  async (req, res) => {
  try {
    const questionId = req.params.questionId;
    // const question = await questions.findById(questionId).populate('answers');
    console.log("Displayanswers question id",questionId);
    const question = await questions.findById(questionId).populate({
      path: 'answers',
      populate: {
        path: 'ans_by',
        model: 'User', 
        select: 'username' 
      }
    });
    console.log("getting question",question);
    const answers = question.answers;
    console.log("Displayanswers",answers);
    res.status(200).json(answers);
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
  }
});

app.get('/getQuestion/:questionId', async (req, res) => {
  try {
    const Question = await questions.find();
    res.status(200).json(Question)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/getTotalAnswers/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const answerCount = await answers.countDocuments({ question: questionId });
    console.log("how many answers are gettong in questiondetail",answerCount);
    res.status(200).json(answerCount);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching total number of answers' });
  }
});

app.get('/getQuestionDetails/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    // Increment the view count and fetch the updated document
    const question = await questions.findByIdAndUpdate(questionId, { $inc: { views: 1 } }, { new: true }).populate('asked_by','username');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching question details' })
  }
});

// route to get all tags with their questions count
app.get('/tagsWithQuestionsCount', async (req, res) => {
  try {
    // Get all tags
    const allTags = await tags.find();

    // Map over each tag and get the questions count
    const tagsWithCount = await Promise.all(allTags.map(async (tag) => {
      const questionsCount = await questions.countDocuments({ tags: tag._id });
      return {
        _id: tag._id,
        name: tag.name,
        questionsCount: questionsCount
      };
    }));

    res.status(200).json(tagsWithCount);
  } catch (error) {
    console.error('Error fetching tags with questions count:', error);
    res.status(500).json({ message: error.message });
  }
});
// GET route to fetch questions by a specific tag
app.get('/getQuestionsByTag/:tagName', async (req, res) => {
  try {
    const tagName = req.params.tagName;
    const tag = await tags.findOne({ name: tagName });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
     const TagQuestions = await questions.find({ tags: tag._id }).populate('tags').populate('answers');

    res.status(200).json(TagQuestions);
  } catch (error) {
    console.error('Error fetching questions by tag:', error);
    res.status(500).json({ message: error.message });
  }
});

/* POST METHODS */
// creating route to post questions
app.post('/postQuestions',authenticateUser, async (req, res) => {
  try {
    const { title, text, tags, summary} = req.body;
    const userId = req.user.userId;
    
    // Create a new Question document with the resolved tagIds
    const newQuestion = new questions({
      title,
      text,
      tags, // Assuming tagIds is an array of ObjectId values
      asked_by: userId,
      summary,
      ask_date_time: Date.now()
    });

    // Save the new question to the database
    await newQuestion.save();

    res.status(201).json(newQuestion); // Respond with the created question
  } catch (error) {
    console.error('Error posting question:', error);
    res.status(500).json({ message: error.message });
  }
});
app.post('/postAnswers',authenticateUser, async (req, res) => {
  try {
    const { text, questionId } = req.body; // Include questionId in the request body
    // Create a new Answer document with text, ans_by, ans_date, and question
    const userId = req.user.userId;
    const newAnswer = new answers({
      text,
      ans_by:userId,
      ans_date: Date.now(),
      question: [questionId], // Link the answer to the question
    });
  
    // Save the new answer to the database
    await newAnswer.save();

    // Update the corresponding Question document
    await questions.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id } // Add the new answer's ObjectId to the answers array
    });

    res.status(201).json(newAnswer); // Respond with the created answer
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/postTags',authenticateUser, async (req, res) => {
  try {
    
   
    const userId=req.user.userId;
    const user = await users.findById(userId);
    console.log("Am I getting reputation",user,user.reputation);
    if (!user || user.reputation < 50) {
      return res.status(403).json({ message: "Insufficient reputation to create new tags" });
    }
    // Normalize the tag name to lowercase for comparison
    const normalizedName = req.body.name.toLowerCase();
    // Check if the tag already exists in the database (case insensitive)
    const existingTag = await tags.findOne({ name: new RegExp('^' + normalizedName + '$', 'i') });

    if (existingTag) {
      // If the tag already exists, respond with the existing tag
      // This tag will have the casing as originally entered by the first user who created it
      res.status(200).json(existingTag);
    } else {
      // If the tag doesn't exist, create a new tag
      // Store the tag as the user entered it, preserving the case
      const newTag = new tags({
        name: req.body.name
      });

      // Save the new tag to the database
      const savedTag = await newTag.save();
      res.status(201).json(savedTag); // Respond with the created tag
    }
  } catch (error) {
    console.error('Error posting tag:', error);
    res.status(500).json({ message: error.message });
  }
});

//create routes to get comments

app.get('/api/comments', async (req, res) => {
 
  const { commentableId, onModel, page = 1 } = req.query;
  const limit = 3;
  try {
      const commentmodel = await comments.find({ commentableId, onModel })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('createdBy', 'username');
      res.json(commentmodel);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching comments' });
  }
  
});
// POST /api/comments
app.post('/api/comments',authenticateUser, async (req, res) => {
  const { content, commentableId, onModel} = req.body;
  const userId=req.user.userId;
  if (content.length > 140) {
      return res.status(400).json({ message: 'Comment is too long' }); //have to fix this
  }

  const voter = await users.findById(userId);

      if (!voter || voter.reputation < 50) {
          return res.status(400).json({ message: "Insufficient reputation to post comments" });
      }
  const comment = new comments({ content, commentableId, onModel, createdBy: userId });
  try {
      await comment.save();
     
      res.status(201).json(comment);
  } catch (error) {
      res.status(500).json({ message: 'Error saving comment' });
  }
});
//upvoting a comment

app.post('/api/comments/:id/upvote', authenticateUser, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.userId; 

  try {
      const user = await users.findById(userId);

      // Check if the user has already voted on this comment
      const hasVotedOnComment = user.votedOn.some(vote => 
          vote.itemId.equals(commentId) && vote.itemType === 'comment'
      );

     

      if (hasVotedOnComment) {
          return res.status(200).json({ message: 'You have already voted on this comment' });
      }

      const comment = await comments.findById(commentId);
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      // Increment vote and record the vote
      comment.votes += 1;
      user.votedOn.push({
          itemId: comment._id,
          itemType: 'comment', 
          voteType: 'upvote' 
      });

      await comment.save();
      await user.save();

      res.json(comment);
  } catch (error) {
      res.status(500).json({ message: 'Error upvoting comment' });
  }
});
//creating routes for userprofile

app.get('/userProfile/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await users.findById(userId);
      console.log("User profile",user);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const membershipDuration = new Date() - user.joinDate;
      const membershipYears = Math.floor(membershipDuration / (1000 * 60 * 60 * 24 * 365));

      let responseData = {
          username: user.username,
          membershipYears: membershipYears,
          reputation: user.reputation,
          isAdmin: user.isAdmin
      };

      res.json(responseData);
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/userQuestions/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const userQuestions = await questions.find({ asked_by: userId }).sort({ ask_date_time: -1 });
      console.log("User questions:", userQuestions);
      res.json(userQuestions);
  } catch (error) {
      console.error('Error fetching user questions:', error);
      res.status(500).send("Internal Server Error");
  }
});

// Update a question
app.put('/updateQuestion/:questionId', authenticateUser, async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const updatedData = req.body;
   
    const updatedQuestion = await questions.findByIdAndUpdate(questionId, updatedData, { new: true });
    
    if (!updatedQuestion) {
      return res.status(404).send("Question not found");
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Delete a question
app.delete('/deleteQuestion/:questionId', authenticateUser, async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Find the question
    const question = await questions.findById(questionId).populate('answers');
    if (!question) {
      return res.status(404).send('Question not found');
    }

    // IDs of answers to be deleted
    const answerIds = question.answers.map(answer => answer._id);

    // Delete the question using deleteOne
    await questions.deleteOne({ _id: questionId });

    // Delete answers associated with the question
    await answers.deleteMany({ _id: { $in: answerIds } });

    // Delete comments associated with the question and its answers
    await comments.deleteMany({ 
      $or: [
        { commentableId: questionId, onModel: 'Question' },
        { commentableId: { $in: answerIds }, onModel: 'Answer' }
      ]
    });

    res.send("Question and related content deleted successfully");
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



// GET /getTagName/:tagId
app.get('/getTagName/:tagId', async (req, res) => {
  try {
    const tagId = req.params.tagId;
    const tag = await tags.findById(tagId);
    if (!tag) {
      return res.status(404).send('Tag not found');
    }
    res.json({ name: tag.name });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
//getting the answer connected to userid only



app.get('/answeredQuestions/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userAnswers = await answers.find({ ans_by: userId })
      .populate({
        path: 'question',
        populate: { path: 'tags', model: 'Tag' }
      })
      .exec();

    const groupedAnswers = {};
    userAnswers.forEach(answer => {
      const questionId = answer.question._id.toString();
      if (!groupedAnswers[questionId]) {
        groupedAnswers[questionId] = {
          question: answer.question.toObject(),
          answers: []
        };
      }
      groupedAnswers[questionId].answers.push({
        _id: answer._id,
        text: answer.text,
        ans_date: answer.ans_date
      });
    });

    // Convert grouped answers to an array and sort by question's ask_date_time
    const answeredQuestionsData = Object.values(groupedAnswers)
      .sort((a, b) => new Date(b.question.ask_date_time) - new Date(a.question.ask_date_time));

    console.log("Sorted answered questions", answeredQuestionsData);
    res.json(answeredQuestionsData);
  } catch (error) {
    console.error('Error fetching answered questions:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/userAnswers/:userId/:questionId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const questionId = req.params.questionId;

    // Find all answers by the user for the specific question
    const userAnswers = await answers.find({ ans_by: userId, question: questionId })
      .populate('question')
      .exec();

    // No need to group since all answers are for the same question
    const answersData = userAnswers.map(answer => ({
      // Your existing transformation logic
    }));

    res.json(answersData);
  } catch (error) {
    console.error('Error fetching user answers for question:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/getUserPrioritizedAnswers/:questionId', authenticateUser, async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.headers['userid'];

  try {
    // Fetch all answers given by the user for the specific question
    const userAnswers = await answers
      .find({ question: questionId, ans_by: userId })
      .populate('ans_by', 'username');
   console.log("All answers",userAnswers);
    // Fetch all other answers for the question, excluding the user's
    const otherAnswers = await answers
      .find({ question: questionId, ans_by: { $ne: userId } })
      .populate('ans_by', 'username')
      .sort({ ans_date: -1 }); // Sort by newest

    // Combine the user's answers with other answers
    const combinedAnswers = [...userAnswers, ...otherAnswers];

    res.status(200).json(combinedAnswers);
  } catch (error) {
    console.error('Error fetching prioritized answers:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.delete('/deleteAnswer/:answerId', authenticateUser, async (req, res) => {
  try {
    const answerId = req.params.answerId;
    //const userId = req.user.userId;
    const userId = req.headers['userid'];
    console.log("user id in delete answer",userId);
    const answer = await answers.findById(answerId).populate('ans_by');
    console.log("Am I not deleting");
    if (!answer || answer.ans_by._id.toString() !== userId) {
      return res.status(403).send("Unauthorized action");
    }
    await questions.updateOne(
      { answers: answerId },
      { $pull: { answers: answerId } }
    );
    const voters = await users.find({ 'votedOn.itemId': answerId, 'votedOn.itemType': 'answer' });

    voters.forEach(async (voter) => {
      voter.votedOn = voter.votedOn.filter(v => v.itemId.toString() !== answerId);
      await voter.save();
    });

    await answers.deleteOne({ _id: answerId });

    await comments.deleteMany({ commentableId: answerId, onModel: 'Answer' });
    res.send("Answer and related content deleted successfully");
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/editAnswer/:answerId', authenticateUser, async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const { newText } = req.body;
    const userId = req.headers['userid'];

    const answer = await answers.findById(answerId);
    if (!answer || answer.ans_by.toString() !== userId) {
      return res.status(403).send("Unauthorized action");
    }

    answer.text = newText;
    await answer.save();
    const updatedAnswer = await answers.findById(answerId).populate('ans_by', 'username');

    res.json({ message: "Answer updated successfully", updatedAnswer });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get tags from questions asked by the authenticated user
app.get('/userTags/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;

      const userQuestions = await questions.find({ asked_by: userId }).populate('tags');
     
      console.log("Why john doe not getting any tags",userQuestions);
      let userTags = [];
      userQuestions.forEach(question => {
          question.tags.forEach(tag => {
              if (!userTags.some(userTag => userTag._id.equals(tag._id))) {
                  userTags.push(tag);
              }
          });
      });

      res.json(userTags);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/getUserSpecificTagsWithQuestionCount/:userId', authenticateUser, async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming user ID is stored in req.user
    console.log("Am I getting userId",userId);
    const userQuestions = await questions.find({ asked_by: userId }).populate('tags');

    let tagCounts = {};

    userQuestions.forEach(question => {
      question.tags.forEach(tag => {
       
        if (!tagCounts[tag._id]) {
          tagCounts[tag._id] = { questionsCount: 1, name: tag.name, _id: tag._id };
        } else {
          // Increment the count for existing tags
          tagCounts[tag._id].questionsCount++;
        }
      });
    });

    // Convert the tagCounts object into an array of tag details with counts
    const tagsWithCount = Object.values(tagCounts);

    res.status(200).json(tagsWithCount);
  } catch (error) {
    console.error('Error fetching user-specific tags with questions count:', error);
    res.status(500).json({ message: error.message });
  }
});


app.get('/getUserQuestionsByTag/:tagName', authenticateUser, async (req, res) => {
  try {
    const tagName = req.params.tagName;
    const userId = req.query.userId;

    const tag = await tags.findOne({ name: tagName });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    let query = { tags: tag._id };
    if (userId) {
      query.asked_by = userId;
    }

    const TagQuestions = await questions.find(query).populate('tags').populate('answers');
    res.status(200).json(TagQuestions);
  } catch (error) {
    console.error('Error fetching questions by tag:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/editTag/:tagId', authenticateUser, async (req, res) => {
  const tagId = req.params.tagId;
  const { newTagName } = req.body; 
  const userId = req.headers['userid']; 

  try {
      // Check if the tag is in use by questions asked by other users
      const isTagInUse = await questions.exists({ tags: tagId, asked_by: { $ne: userId } });
      if (isTagInUse) {
          return res.status(403).json({ message: 'Tag is in use by other users and cannot be edited' });
      }

      const updatedTag = await tags.findByIdAndUpdate(tagId, { name: newTagName }, { new: true });
      if (!updatedTag) {
          return res.status(404).json({ message: 'Tag not found' });
      }

      res.json({ message: 'Tag updated successfully', updatedTag });
  } catch (error) {
      console.error('Error updating tag:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/deleteTag/:tagId', authenticateUser, async (req, res) => {
  try {
      const tagId = req.params.tagId;
      const userId = req.headers['userid'];

     
      const isTagUsedByOthers = await questions.findOne({ tags: tagId, asked_by: { $ne: userId } });
      if (isTagUsedByOthers) {
          return res.status(403).json({ message: 'Cannot delete tag: It is in use by other users.' });
      }

     
      await tags.findByIdAndDelete(tagId);
      const removeTagFromQuestions = async (tagId, userId) => {
        await questions.updateMany(
            { asked_by: userId, tags: tagId },
            { $pull: { tags: tagId } }
        );
    };
    
   
    await removeTagFromQuestions(tagId, userId);
      
      res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/getUserTotalTags/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const userQuestions = await questions.find({ asked_by: userId });

    // Create a set to store unique tag IDs
    let uniqueTagIds = new Set();

    // Iterate over each question and add its tags to the set
    userQuestions.forEach(question => {
      question.tags.forEach(tagId => {
        uniqueTagIds.add(tagId.toString()); 
      });
    });

   console.log('here I am',uniqueTagIds.size);

    res.status(200).json({ totalUserTags: uniqueTagIds.size });
  } catch (error) {
    console.error('Error fetching user-specific total tags:', error);
    res.status(500).json({ message: error.message });
  }
});
// admin


// Endpoint to get user's admin status
app.get('/api/user/status', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const admin = user.isAdmin;
    console.log("Admin value", admin);

    res.json({ isAdmin: admin });
  } catch (error) {
    console.error('Error fetching user status:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/users', async (req, res) => {
  try {
      const user = await users.find({}); 
      console.log("Am I not finding the users",user);
      res.json(user);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
  }
});
app.delete('/api/users/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await users.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Fetch the user's questions
      const userQuestions = await questions.find({ asked_by: userId });
      const questionIds = userQuestions.map(q => q._id);

      // Get all unique tag IDs from these questions
      const tagIdsToDelete = new Set();
      userQuestions.forEach(question => {
          question.tags.forEach(tagId => {
              tagIdsToDelete.add(tagId.toString());
          });
      });

      // Delete the tags
      for (let tagId of tagIdsToDelete) {
          await tags.findByIdAndDelete(tagId);
      }

      // Delete the user's questions
      await questions.deleteMany({ _id: { $in: questionIds } });

      // Delete answers created by the user
      await answers.deleteMany({ ans_by: userId });

      // Delete comments created by the user
      await comments.deleteMany({ createdBy: userId });

      // Finally, delete the user
      await users.findByIdAndDelete(userId);

      res.send({ message: 'User and associated content deleted successfully' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
      const userId = req.user.userId;
      // Find the user in the database
      const user = await users.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          // other fields you want to include
      };

      res.json(userData);
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/api/admin', authenticateUser, async (req, res) => {
  try {
      const userId = req.user.userId; // From authenticateUser middleware

      const user = await users.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      if (!user.isAdmin) {
          return res.status(403).send('Access denied. Only admins can access this information.');
      }

      // Calculate membership duration
      const membershipDuration = new Date() - user.joinDate;
      const membershipYears = Math.floor(membershipDuration / (1000 * 60 * 60 * 24 * 365));

      // Prepare and send the admin user profile data
      const adminProfileData = {
          username: user.username,
          membershipYears: membershipYears,
          reputation: user.reputation,
          isAdmin: user.isAdmin
      };

      res.json(adminProfileData);
  } catch (error) {
      console.error('Error fetching admin user profile:', error);
      res.status(500).send('Internal Server Error');
  }
});



app.get('/api/user/:userId', authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
      let user;
      if (userId === 'current') {
          // Fetch the currently logged-in user's data
          const currentUserId = req.user.userId; // Assuming your authentication middleware sets req.user
          user = await users.findById(currentUserId);
      } else {
          // Fetch the data of the user specified by userId
          user = await users.findById(userId);
      }

      if (!user) {
          return res.status(404).send('User not found');
      }

      const { password, ...userData } = user.toObject();

      res.json(userData);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;

    // Query the database to check if the email exists
    const existingUser = await users.findOne({ email });

    // Send response indicating whether the email exists
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});