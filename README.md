# Campus life planner 
this is a web application which is responsive build using HTML, CSS and JavaScript. This web app allows students to manage their academic task and track study durations.

## features
* Add, edit, mark complete and delete tasks.
* Data auto-saves to the local storage 
* this a mobile first layout using flex box and media queries.
* dashboard that shows total tasks, completion status and total study duration.
* also shows the remaining time in relation to the daily duration set.

## regex catalog 

name validation : /^\S(?:.*\S)?$/ this forbids any leading spaces 
numeric validation : /^[1-9]\d*$/ . no decimal allowed
Date Validation :  ^\d{4}-(0[1-9]
duplicate: (\b\w+)\s+\1. this prevents duplicating words


### How to run tests 

to check  the regex validation logic, run the application in a browser and navigate to the add new task section and then run tests as following:

1. name validation: try typing a name with a leading space ( name) and the app will display an error.
2. duplicate word: trying entering a duplicate word like "study math math". and a warning box should appear.
3. numeric validation: try entering 0 or -5 . an error should be displayed.


##deployment

repo url:https://github.com/lilianeuwase2/liliane_uwase-SummativeAssignent_BuildingResponsiveUI.git