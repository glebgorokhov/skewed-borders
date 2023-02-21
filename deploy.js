import ghpages from "gh-pages";

ghpages.publish('dist', {
  branch: "gh-pages",
  repo: "git@github.com:glebgorokhov/skewed-borders.git",
}, () => {
  console.log("Success!")
});
