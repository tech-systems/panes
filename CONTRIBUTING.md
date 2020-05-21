# How to contribute

There are a few guidelines that we need contributors to follow so that we have a
chance of keeping on top of things.

### 1. Where do I go from here?
If you've noticed a bug or have a question, [make an issue](https://github.com/roman-rr/cupertino-pane/issues/new),
we'll try to answer it as fast as possible.
### 2. Fork & Create a branch
If this is something you think you can fix, then
[fork Cupertino Pane](https://help.github.com/articles/fork-a-repo)
and create a branch.
```sh
# Create new branch
git checkout -b my_issue

# Then we install the dependencies
npm install
```
### 3. Test with Playground
```sh
gulp server
```
### 4. Changes & Build
```sh
# Make bundles 
gulp build
```
This will output the files into the dist directory.
### 5. Push changes
Push your changes to a topic branch in your fork of the repository.
Submit a pull request to the repository.
It can take several days before we can review the code you've submitted. 
