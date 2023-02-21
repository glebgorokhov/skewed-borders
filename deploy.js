import ghpages from "gh-pages";

ghpages.publish('dist', {
  branch: "gh-pages",
  repo: "git@github.com:peaceiris/actions-gh-pages.git",
}, () => {
  console.log("Success!")
});
