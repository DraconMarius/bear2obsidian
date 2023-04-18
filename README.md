# bear2obsidian

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description

A Node.js script to duplicate an export directory of Bear Markdown Files, while mimicking folder structures based on BearTags. It groups all the exported assets, and edits any backlinks so one can easily export to Obsidian. It ~~also reads the create/edit time for the files and prepend it as a YAML block~~ now retain the edited and creation time.

![demo.gif](./aseets/demo.gif)

**Note**: 
- [ ] Only read first tag in note (personal usecase)
- [ ] Duplicated Note name not supported
- [x] Edge Cases in Tag formatting might experience errors
> improved tag parsing, please submnit an issue if you do experience any
- [ ] Require installation of node.js
- [x] Tags with spaces
> Tags with spaces will now create the folder using original name with spaces, but will fix the tag in the markdown itself with `_` so it can be recognised by Obsidian
- [X] Create/ Edit Time
> Implemented. Instead of copying over to new export folder after formatting, it directly write to the original file and then moved to the destination folder. ~~(I wasn't able to get both, and end up prioritized file create time for now)~~

*please note that this is mainly to automate the transition, and make it a tad bit easier for myself. Instead of manually sorting through your notes one by one and creating a folder manually. Please keep in mind that you might still have to make some fine-tune and reorganize your notes once your got it imported to Obsidian!*

## Usage

**please make sure that you have the node.js installed**

Make sure that you export your Bear note with attachements as Markdown to a new folder named `BearExport`. *After implemnting the change that allow us to retain timestamps, this folder's content will be transformed and moved after running this script.

> You can name the folder anything you want really, but you will have to edit the path to the source folder within the code:
```javascript
// Make sure to change to the correct source and destination path!
const bearNotesFolderPath = './BearExport'; //default points to a folder named "BearExport" in root
const obsidianVaultFolderPath = './ObsidianExport'; //default points to empty folder in root
```

Then clone this respository to your local machine and copy the whole folder to the root of this repository. (Double check that the copy of the Bear notes retain the accurate created/edited metadata after copying.)

You can then run the following bash command at the root of the repository to install any required dependency.

``` bash
    npm install
```

then:

``` bash
    npm start
```
to initate the script. Once everything has been compiled, you should be able to see the previously empty `ObsidianExport` folder is now populated with content, and the original `BearExport` folder is now empty.

Now you can drag your content from the Obsidian Export folder into your Obsidian Vault Folder and then when you open Obsidian you should be able to access and start reorganizing your note in the new directory structure based off of your bear tag!

## Additional Resources
Here are some additional resources that was super helpful in my research to migrate from Bear and writing this simple script: 

[Setting up Obsidian Sync with iCloud Drive by @philiprpowis](https://medium.com/@philiprpowis/setting-up-obsidian-sync-with-icloud-drive-459a14e5e070)

[How to successfully move notes from Bear to Obsidian by @alexandersnotes](https://medium.com/@alexandersnotes/how-to-move-notes-from-bear-to-obsidian-2fb4f62cdd72)

[Use YAML Front Matter Correctly in Obsidian by @amyjuanli](https://amyjuanli.medium.com/use-yaml-front-matter-correctly-in-obsidian-550e4fa46a4a)

[obsidian_bear by @bernardoamc](https://github.com/bernardoamc/obsidian_bear)



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

I created this mainly just to ease my migration to Obsidian, but if there is a specific use case that you would want me to take a look at please let me know!
