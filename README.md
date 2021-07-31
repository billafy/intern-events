# Title 

An express based backend server for <title>

# Stucture of the application :-
	/app contains all the functional code with the MVC structure
		/controllers consists of the controller or view functions implementing the business logic
		/routers routes the requests mapped to the respective urls and forwards to the controller functions
		/schema has the database models specified
		auth - several authentication/authorization functions
		server - the central server setup
		socketConnection - socket handler for realtime chats
		staticStorage - utility functions for media storage
		utils - miscellanous utility functions
		validators - functions to validate the incoming data
	/media stores all kinds of media items such as profile pictures, resumes, etc

	/controllers and /routers both are divided into 3 submodules :-
		1) accounts
		2) internships and events
		3) social (posts, user-to-user interactions, messaging)