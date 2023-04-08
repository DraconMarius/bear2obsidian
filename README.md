# bear2obsidian

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description

Node.js script to duplicate an export directory of Bear Markdown Files, while handling updating the structure based on tags, assets, and backlink so one can easily export to Obsidian. It also reads the create/edit time for the files and prepend it to the export for Obsidian.

**Note**: 
- [ ] Only read first tag in note (personal usecase)
- [ ] Duplicated Note name not supported
- [ ] Tags cannot have spaces (#tag 1/sub tag#)
- [ ] Edge Cases in Tag formatting might experience errors
- [x] Create/Edit Time
> Create/Edit Time as YAML implemented. Not sure if able to get the created/edited time without hard coding so it will update as we edit these imported note. 

*please note that this is just to automate the transition and make a tad bit easier, instead of manually sorting through your notes one by one. Please keep in mind that you might still have to make some adjustment and reorganize your notes once your got it imported to Obsidian!*

## Usage

**please make sure that you have the node.js installed**

First, make sure that you export your Bear note with attachements as Markdown to a new folder named `BearExport`. 

> You can name the folder anything you want really, but you will have to edit the path to the source folder within the code!

Then clone this respository to your local machine and copy the whole folder to the root of this repository. (double check that the copy of the Bear notes retain the accurate created/edited metadata after copying)

You can then run the following bash command at the root of the repository to install any required modules.

``` bash
    npm install
```

then:

``` bash
    npm start
```
to initate the script. Once everything has been compiled, you should be able to see the previously empty `ObsidianExport` folder is now populated with content!

Now you can drag your content from the Obsidian Export folder into your Obsidian Vault Folder and then when you open Obsidian you should be able to access and start reorganizing your note in the new directory structure based off of your bear tag!


## License

Licensed under the MIT license.
[License details here](https://opensource.org/licenses/MIT)

## Technologies Used
> JavaScript

> node.js

> fs-extra

## Authors

[<img src="https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_github_icon_143196.png" alt='github' height='40'>](https://github.com/DraconMarius)
[<img src="https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_linkedin_icon_143191.png" alt='linkedin' height='40'>](https://www.linkedin.com/in/mari-ma-70771585/)

[Icon credit @ Anton Kalashnyk](https://icon-icons.com/users/14quJ7FM9cYdQZHidnZoM/icon-sets/)

## Contributing

Feel free to let me know if you'd like to contribute, or if you have any idea for improvement

## Questions

For any questions, please reach out by creating an issue :)

I created this mainly just to ease my transition to Obsidian, but if there is a specific use case that you would want me to take a look at please let me know!
