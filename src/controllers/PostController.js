export class PostController{
  data = { 
    "home":{
      title: "Welcome to new home!",
      body: "Welcome to new home! this is a home page that built in web component, without any bundling and other webpack stuff... This website is under develop, if the website getting weird, try to clean the cache and refresh.",
      date: "May 23 2022",
      tags:"test_post"
    },
    // "custom_A":{
    //   title: "Custom A",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
    // "custom_B":{
    //   title: "Custom B",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
    // "custom_C":{
    //   title: "Custom C",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
    // "custom_D":{
    //   title: "Custom D",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
    // "custom_E":{
    //   title: "Custom E",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
    // "custom_F":{
    //   title: "Custom F",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
    // "custom_G":{
    //   title: "Custom G",
    //   body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   date: "May 23 2022",
    //   tags:"test_post"
    // },
  };

  constructor(){
  }

  getPostDate(id){
    if(!(id in this.data)) return "";
    return this.data[id].date;
  }

  getPostContent(id){
    if(!(id in this.data)) return "404 Not found";
    return this.data[id].body;
  }

  getPostTitle(id){
    if(!(id in this.data)) return "404 Not found";
    return this.data[id].title;
  }

  getPostList(){
    return Object.keys(this.data);
  }
}