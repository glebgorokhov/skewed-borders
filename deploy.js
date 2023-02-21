import ghpages from "gh-pages";

ghpages.publish('dist', {
  branch: "gh-pages",
  repo: "git@github.com:glebgorokhov/skewed-borders.git",
  message: "Deploy: build to gh-pages"
}, () => {
  console.log("Success!")
});
