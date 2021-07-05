const db = require("../_helpers/db");
const axios = require('axios');
const throttledQueue = require('throttled-queue');
const Story = db.Story;

module.exports = {
  populateWeekStoriesFromStartingDate,
  getStoriesByDate,
  getTopTenWordsByDate
};

// Populate the stories for a week given a start date
// If start date is '2021-06-28', all stories from '2021-06-28' until '2021-07-04' will be added to the database
async function populateWeekStoriesFromStartingDate(storyParam) {
  // console.log('storyparam: ', storyParam);
  //Number of days to add
  const totalDays = 7;
  const inputDate = new Date(storyParam);
  const beginDate = new Date(inputDate).getTime()/1000;
  const endDate = new Date(inputDate.setDate(inputDate.getDate() + totalDays)).getTime()/1000;
  //get maxid
  const resultMaxId = await axios.get(`https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty`);
  const maxId = resultMaxId.data;
  let arr = Array.from({length: maxId}, (_, i) => i + 1);
  let throttle = throttledQueue(30, 1000);

  //search for stories and add to database
  for(let i=0; i < arr.length; i++) {
    await throttle(async function () {
      // console.log('going through ids: ', arr[i]);
      const result = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${arr[i]}.json?print=pretty`);
      const story = result.data;
      if(story && story.type === 'story') {
        if(story.time >= beginDate && story.time < endDate) {
          const storyData = new Story(story);
          if (await Story.findOne({ name: storyData.id })) {
            throw 'This story already exists!';
          } else {
            await storyData.save();
          }
        }
      }
    });
  }
}

// Get all the stories of a given date
async function getStoriesByDate(storyParam) {
  const inputDate = new Date(storyParam);
  const beginDate = new Date(inputDate.getDate()).getTime()/1000;
  const endDate = new Date(inputDate.setDate(inputDate.getDate() + 1)).getTime()/1000;

  return  await Story.find({ time: {$gte: beginDate, $lt: endDate} });
}

// Get the top ten words corresponding to this week day, but from the previous week
async function getTopTenWordsByDate() {
  //Get current date
  let inputDate = new Date();
  inputDate.setHours(0,0,0,0);
  //Define begin and end dates
  const beginDate = new Date(new Date(inputDate).setDate(inputDate.getDate() - 7)).getTime()/1000;
  const endDate = new Date (new Date(inputDate).setDate(inputDate.getDate() - 6)).getTime()/1000;
  // console.log('beginDate: ' , beginDate);
  // console.log('endDate: ' , endDate);

  //get stories from the database
  const stories = await Story.find({ time: {$gte: beginDate, $lt: endDate} });
  //initialize arrays for word tracking
  let WordsFromAllStories = [];
  let topTenWords = []
  //search the titles of the stories and add the words if they don't already exist
  stories.forEach((story)=>{
    if(story.title && !story.deleted){
      let words = story.title.split(" ");
      words.forEach((word)=>{
        const tempWord = word.toLowerCase();
        const index = WordsFromAllStories.indexOf(tempWord);
        if(index === -1) {
          WordsFromAllStories.push(tempWord);
          topTenWords.push({ word: tempWord, count: 1 });
        } else {
          topTenWords[index].count++;
        }
      });
    }
  });
  //Sort by higher word count
  topTenWords.sort(function(a, b) {
    return b.count - a.count;
  });
  //return only the first 10 entries
  topTenWords = topTenWords.slice(0,10);
  return topTenWords;
}