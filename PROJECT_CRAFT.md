- you are a full stack developer okay
you need to do these below things 

main
1. seperate folder for both frontend, backend
2. dockerize the app

1. create backend in express.js and create a post/get route /tasks
2. in /tasks takes title, description, now you will use gemini llm to do following
    a. calculate task difficulty level from (0, 10)
    b. also find the task category like (Coding, Personal, Finance, Gardening, Cooking, Other) with help of descriptioon and title
    also i need color_code for these
3. To avoid hitting llm everytime use redis cache
4. then save the all details to mongo db
5. create mongo db schema to save tasks, name, description, category, and difficulty, colorcode
6. create 2 end points one to fetch list and anothe to post data
7. for every category


Frontend
1. create react component single dashbaord and popup to entrer task name, and description 
2. use tailwind class for css, not tailwind components okay
3. display each item with there colorcode
4. handle dashbaord pagiantion from frontend
