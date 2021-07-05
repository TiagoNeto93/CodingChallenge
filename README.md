# FIND THE TOP 10 WORDS
###### This node app was made to extend Hacker News functionalities.<br/>
The objective of this app is to return the top 10 words of this day of the previous week news stories, meaning, if today is Monday (05/07/2021) we want the top 10 words from the previous Monday (28/06/2021).<br/>
As our source of stories, we are using Hacker News' API. You can find more about that API [here](https://github.com/HackerNews/API#readme/).</br>
## Prerequisite
In order to run this project, you need Node.js installed on your computer.</br>
To do so, you can check Node.js download page [here](https://nodejs.org/en/download/).
## Assumptions
Given the defined properties of an item in Hacker News' API, we are only considering elements where the property ```type``` equals ```story```. This means that all the other types are discarded.</br>
Only the stories from the previous week are relevant, current stories are discarded and should not be considered.</br>
## Find the stories from last week
Since Hacker News' API does not provide a way to obtain the news of a given day, we need to search through all the existing news and find the ones relevant to our timeline. We can do so by going backwards from the maxitem provided by Hacker News' API:
https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty<br/>
After finding the relevant stories, we then populate our database, in MongoDB, with the stories form the previous week. As mentioned above in the "Assumptions" section, we only store the items with: ```type: story```.</br>
The model used to define a story is the following:
```
  id: Number,
  deleted: Boolean,
  type: String,
  by: String,
  time: Number,
  text: String,
  dead: Boolean,
  parent: Number,
  poll: Number,
  kids: [Number],
  url: String,
  score: Number,
  title: String,
  parts: Number,
  descendants: Number
```
## Getting the top ten words
Now that our database is populated with the needed stories, we can then search through the stories' titles and find the top 10 most occurring words of the day.<br/>
This means that we will loop through the stories of a given day, searching for the top 10 words that occur the most.</br>

## Up and running
To get this app up and running, you can start by:
  1. Simply clone this repository to your local environment
  2. Open a terminal on the cloned local repository root folder and run the command ```npm install```
  3. After successful installation from ```npm install``` run ```node server.js``` on a terminal in the cloned local repository root folder. When the server is up and running, you should see ```Server listening on port 3000``` on the terminal
 
After executing those steps successfully, you can go to: http://localhost:3000/api/stories/topten to check the top 10 words.

## The choices that were made
Hacker News doesn't provide an optimal way to find the stories by date, and so, a solution on our end is required to do so.</br>
As our first step, we opted by using MongoDB and populating the database with relevant stories from the previous week:</br>
 1. To do so, we need to loop through the items on Hacker News and send a request to Hacker News to obtain the item to see if it corresponds to a story (```type: story```)
 2. If it corresponds to a story, and it is in the relevant timeframe (previous week) then it should be added to our database.</br>

The stories are saved on our database with a similar model to the item model present in Hacker News API. This decision was based on future features that can be implemented without the necessity of doing extra request to the API.</br>
After the first step of getting the stories on our database, the process of obtaining the top 10 most occurring words becomes simple, as we only need to search through the stories of a given date and find the most occurring ones.</br>
This approach was followed because traversing through the news of Hacker News by maxid and finding the relevant news for a given date, at runtime, would not be efficient and would result in an enormous amount of waiting time.</br>

## Optimizations
There are a few optimizations that could be done to this current version, but the most important would be to run a population function on the start of our server.js and then run it once after X seconds to make sure we are storing relevant news stories.</br>
This function should consider the most recent id, in our database, as a starting point and send request to Hacker News from that id to the current maxid in Hacker News.
  
## Relevant packages
**rootpath**: helper to make node.js require relative to project root</br>
**express**: Web framework for node. Used to define our API.</br>
**config**: Allowd configuration control for different environments. Used to create our default configuration.</br>
**mongoose**: MongoDB ODM. Used to connect to our database, define the model, and preform our operations.</br>
**axios**: HTTP client for node. Used to make request to Hacker News' API</br>
**throttled-queue**: Throttles arbitrary code to execute a maximum number of times per interval. Used to throttle request to Hacker News' API.<br>
