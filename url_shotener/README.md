Take a valid url and return a shortened url, redirecting the user to the previously provided url.

routes
POST/URL:-genrate a new short URL and returnd the shortened URL in the format example.com/random-id

GET/:id:-Redirects the user to the original URL

GET?URL?analytics/:id:- to get the total number of clicks on an URL shortener.


for server-side rendering we can use-

app.get("/test",(req,res)=>{
    return res.end("<h1>Hey from the servevr</h1>")
})

but this is not at all convenient. hence we have templates like ejs,pugjs etc.



BUGS----
1. no fromtend for user signin
2. when we create a shortid it is created. but if there is some issue is rendering the multiple shortids for the same link is generated - (fix:-
add a delete button)
3. no css
think of some other fix as well